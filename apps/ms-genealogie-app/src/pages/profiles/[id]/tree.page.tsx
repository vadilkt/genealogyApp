import { ApartmentOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Select, Space, Spin, Tabs, Tag, Typography } from 'antd';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { AncestorNode, DescendantNode } from '@/domains/family/types';
import { useAncestors, useDescendants, useSiblings, useSpouses } from '@/domains/family/useFamily';
import type { Profile } from '@/domains/profiles/types';
import { useProfile } from '@/domains/profiles/useProfiles';

import styles from './tree.module.scss';

const { Title, Text } = Typography;

// ─── Layout constants ─────────────────────────────────────────────────────────
const NW = 168; // node width  (px)
const NH = 70;  // node height (px)
const HG = 24;  // horizontal gap between nodes
const VG = 60;  // vertical gap between generations
const PAD = 40; // canvas padding

// ─── Types ───────────────────────────────────────────────────────────────────
type NodeType = 'root' | 'sibling' | 'spouse' | 'default';

interface LayoutNode {
    profile: Profile;
    depth: number;
    x: number;
    y: number;
    animDelay: number;
    nodeType: NodeType;
}

interface LayoutEdge {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    animDelay: number;
    dashed: boolean;
}

interface TreeLayout {
    nodes: LayoutNode[];
    edges: LayoutEdge[];
    w: number;
    h: number;
}

// ─── Ancestor layout ──────────────────────────────────────────────────────────
// Person at bottom (depth 0); ancestors grow upward.
// Siblings pre-reserved on the left; spouses placed to the right of all ancestors.
// Sibling→parent edges are drawn as dashed lines.
function layoutAncestors(root: AncestorNode, siblings: Profile[], spouses: Profile[]): TreeLayout {
    const nodes: LayoutNode[] = [];
    const edges: LayoutEdge[] = [];
    let leafCounter = siblings.length; // pre-reserve left columns for siblings
    const posMap = new Map<number, { x: number; y: number; depth: number }>();

    function maxD(node: AncestorNode | null, d: number): number {
        if (!node) return d - 1;
        return Math.max(maxD(node.father, d + 1), maxD(node.mother, d + 1));
    }
    const maxDepth = Math.max(0, maxD(root, 0));
    const rootRowY = maxDepth * (NH + VG) + PAD;

    function assignCols(node: AncestorNode | null, depth: number): number | null {
        if (!node) return null;
        const fCol = assignCols(node.father, depth + 1);
        const mCol = assignCols(node.mother, depth + 1);

        let col: number;
        if (fCol === null && mCol === null) {
            col = leafCounter++;
        } else if (fCol !== null && mCol !== null) {
            col = (fCol + mCol) / 2;
        } else {
            col = (fCol ?? mCol) as number;
        }

        const x = col * (NW + HG) + PAD;
        const y = (maxDepth - depth) * (NH + VG) + PAD;
        posMap.set(node.profile.id, { x, y, depth });
        nodes.push({
            profile: node.profile,
            depth,
            x,
            y,
            animDelay: depth * 150,
            nodeType: depth === 0 ? 'root' : 'default',
        });
        return col;
    }

    function addEdges(node: AncestorNode | null) {
        if (!node) return;
        const pos = posMap.get(node.profile.id);
        if (!pos) return;
        [node.father, node.mother].forEach((parent) => {
            if (!parent) return;
            const parentPos = posMap.get(parent.profile.id);
            if (!parentPos) return;
            edges.push({
                x1: pos.x + NW / 2,
                y1: pos.y,            // child top-center
                x2: parentPos.x + NW / 2,
                y2: parentPos.y + NH, // parent bottom-center
                animDelay: pos.depth * 150 + 100,
                dashed: false,
            });
            addEdges(parent);
        });
    }

    assignCols(root, 0);
    addEdges(root);

    // Look up parent positions for sibling→parent dashed edges
    const fatherPos = root.father ? posMap.get(root.father.profile.id) : undefined;
    const motherPos = root.mother ? posMap.get(root.mother.profile.id) : undefined;

    // Add siblings at pre-reserved left columns (same row as root)
    siblings.forEach((sib, i) => {
        const x = i * (NW + HG) + PAD;
        nodes.push({ profile: sib, depth: 0, x, y: rootRowY, animDelay: 80, nodeType: 'sibling' });
        if (fatherPos) {
            edges.push({
                x1: x + NW / 2, y1: rootRowY,
                x2: fatherPos.x + NW / 2, y2: fatherPos.y + NH,
                animDelay: 200, dashed: true,
            });
        }
        if (motherPos) {
            edges.push({
                x1: x + NW / 2, y1: rootRowY,
                x2: motherPos.x + NW / 2, y2: motherPos.y + NH,
                animDelay: 200, dashed: true,
            });
        }
    });

    // Add spouses to the right of all ancestor columns
    const ancestorColCount = Math.max(1, leafCounter);
    spouses.forEach((spouse, j) => {
        const x = (ancestorColCount + j) * (NW + HG) + PAD;
        nodes.push({ profile: spouse, depth: 0, x, y: rootRowY, animDelay: 80, nodeType: 'spouse' });
    });

    const totalCols = ancestorColCount + spouses.length;
    const w = totalCols * (NW + HG) - HG + 2 * PAD;
    const h = (maxDepth + 1) * (NH + VG) - VG + 2 * PAD;
    return { nodes, edges, w, h };
}

// ─── Descendant layout ────────────────────────────────────────────────────────
// Person at top (depth 0); descendants grow downward.
// Spouses shown to the right. Siblings are NOT shown here (they belong in the ancestor tree).
function layoutDescendants(root: DescendantNode, spouses: Profile[]): TreeLayout {
    const nodes: LayoutNode[] = [];
    const edges: LayoutEdge[] = [];
    let leafCounter = 0;
    const posMap = new Map<number, { x: number; y: number; depth: number }>();
    let maxDescDepth = 0;

    function assignCols(node: DescendantNode, depth: number): number {
        maxDescDepth = Math.max(maxDescDepth, depth);
        let col: number;
        if (node.children.length === 0) {
            col = leafCounter++;
        } else {
            const childCols = node.children.map((c) => assignCols(c, depth + 1));
            col = (childCols[0] + childCols[childCols.length - 1]) / 2;
        }
        const x = col * (NW + HG) + PAD;
        const y = depth * (NH + VG) + PAD;
        posMap.set(node.profile.id, { x, y, depth });
        nodes.push({
            profile: node.profile,
            depth,
            x,
            y,
            animDelay: depth * 150,
            nodeType: depth === 0 ? 'root' : 'default',
        });
        return col;
    }

    function addEdges(node: DescendantNode) {
        const pos = posMap.get(node.profile.id);
        if (!pos) return;
        node.children.forEach((child) => {
            const childPos = posMap.get(child.profile.id);
            if (!childPos) return;
            edges.push({
                x1: pos.x + NW / 2,
                y1: pos.y + NH,      // parent bottom-center
                x2: childPos.x + NW / 2,
                y2: childPos.y,      // child top-center
                animDelay: pos.depth * 150 + 100,
                dashed: false,
            });
            addEdges(child);
        });
    }

    assignCols(root, 0);
    addEdges(root);

    const rootRowY = PAD; // root is always at depth 0

    // Add spouses to the right of all descendants
    const descColCount = Math.max(1, leafCounter);
    spouses.forEach((spouse, j) => {
        const x = (descColCount + j) * (NW + HG) + PAD;
        nodes.push({ profile: spouse, depth: 0, x, y: rootRowY, animDelay: 80, nodeType: 'spouse' });
    });

    const totalCols = descColCount + spouses.length;
    const w = totalCols * (NW + HG) - HG + 2 * PAD;
    const h = (maxDescDepth + 1) * (NH + VG) - VG + 2 * PAD;
    return { nodes, edges, w, h };
}

// ─── SVG tree renderer ────────────────────────────────────────────────────────
const SvgTree = ({ nodes, edges, w, h }: TreeLayout) => {
    const router = useRouter();

    return (
        <div className={styles.treeScroll}>
            <div className={styles.treeCanvas} style={{ width: w, height: h }}>
                {/* Bezier paths */}
                <svg
                    width={w}
                    height={h}
                    style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                >
                    {edges.map((e, i) => {
                        const midY = (e.y1 + e.y2) / 2;
                        const d = `M ${e.x1},${e.y1} C ${e.x1},${midY} ${e.x2},${midY} ${e.x2},${e.y2}`;
                        if (e.dashed) {
                            return (
                                <path
                                    key={i}
                                    d={d}
                                    className={styles.treePathDashed}
                                    fill="none"
                                    stroke="#c4956a"
                                    strokeWidth={1}
                                    strokeDasharray="8,4"
                                    strokeOpacity={0.5}
                                    style={{ animationDelay: `${e.animDelay}ms` }}
                                />
                            );
                        }
                        return (
                            <path
                                key={i}
                                d={d}
                                pathLength={1}
                                className={styles.treePath}
                                fill="none"
                                stroke="#c4956a"
                                strokeWidth={1.5}
                                style={{ animationDelay: `${e.animDelay}ms` }}
                            />
                        );
                    })}
                </svg>

                {/* Node cards */}
                {nodes.map((node) => {
                    const birthYear = new Date(node.profile.dateOfBirth).getFullYear();
                    const deathYear = node.profile.dateOfDeath
                        ? new Date(node.profile.dateOfDeath).getFullYear()
                        : null;
                    const extraClass =
                        node.nodeType === 'root' ? styles.rootNode :
                        node.nodeType === 'sibling' ? styles.siblingNode :
                        node.nodeType === 'spouse' ? styles.spouseNode :
                        '';
                    return (
                        <div
                            key={node.profile.id}
                            className={`${styles.treeNode} ${extraClass}`}
                            style={{
                                left: node.x,
                                top: node.y,
                                width: NW,
                                height: NH,
                                animationDelay: `${node.animDelay}ms`,
                            }}
                            onClick={() => router.push(`/profiles/${node.profile.id}`)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') router.push(`/profiles/${node.profile.id}`);
                            }}
                        >
                            <div className={styles.genderBar} data-gender={node.profile.gender} />
                            <div className={styles.nodeContent}>
                                <div className={styles.nodeName}>
                                    {node.profile.firstName} {node.profile.lastName}
                                </div>
                                <div className={styles.nodeDates}>
                                    {birthYear}
                                    {deathYear ? ` – ${deathYear}` : ''}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ─── Count helpers ────────────────────────────────────────────────────────────
const countAncestors = (node: AncestorNode | null): number => {
    if (!node) return 0;
    return 1 + countAncestors(node.father) + countAncestors(node.mother);
};

const countDescendants = (node: DescendantNode): number =>
    1 + node.children.reduce((acc, c) => acc + countDescendants(c), 0);

// ─── Depth selector ───────────────────────────────────────────────────────────
const DEPTH_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8].map((d) => ({
    value: d,
    label: `${d} génération${d > 1 ? 's' : ''}`,
}));

// ─── Page content ─────────────────────────────────────────────────────────────
const TreeContent = () => {
    const router = useRouter();
    const id = Number(router.query.id);
    const [depth, setDepth] = useState(4);

    const { data: profile } = useProfile(id);
    const { data: ancestors, isLoading: loadingAncestors } = useAncestors(id, depth);
    const { data: descendants, isLoading: loadingDescendants } = useDescendants(id, depth);
    const { data: spouses = [] } = useSpouses(id);
    const { data: siblings = [] } = useSiblings(id);

    if (!id) return <Spin />;

    const ancestorCount = ancestors ? countAncestors(ancestors) - 1 : 0;
    const descendantCount = descendants ? countDescendants(descendants) - 1 : 0;

    const ancestorLayout = ancestors ? layoutAncestors(ancestors, siblings, spouses) : null;
    const descendantLayout = descendants ? layoutDescendants(descendants, spouses) : null;

    const tabs = [
        {
            key: 'ancestors',
            label: (
                <span>
                    Ancêtres
                    {ancestorCount > 0 && (
                        <Tag color="orange" style={{ marginLeft: 6 }}>
                            {ancestorCount}
                        </Tag>
                    )}
                </span>
            ),
            children: loadingAncestors ? (
                <Spin style={{ display: 'block', margin: '40px auto' }} />
            ) : !ancestorLayout ? (
                <Empty description="Aucun ancêtre trouvé" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
                <SvgTree {...ancestorLayout} />
            ),
        },
        {
            key: 'descendants',
            label: (
                <span>
                    Descendants
                    {descendantCount > 0 && (
                        <Tag color="green" style={{ marginLeft: 6 }}>
                            {descendantCount}
                        </Tag>
                    )}
                </span>
            ),
            children: loadingDescendants ? (
                <Spin style={{ display: 'block', margin: '40px auto' }} />
            ) : !descendants || descendantCount === 0 ? (
                <Empty
                    description="Aucun descendant enregistré"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    <Button onClick={() => router.push(`/profiles/${id}`)}>
                        Gérer la famille
                    </Button>
                </Empty>
            ) : (
                <SvgTree {...descendantLayout!} />
            ),
        },
    ];

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 24,
                }}
            >
                <Space align="center">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.push(`/profiles/${id}`)}
                    >
                        Retour au profil
                    </Button>
                    <div>
                        <Title level={3} style={{ margin: 0 }}>
                            <ApartmentOutlined /> Arbre généalogique
                        </Title>
                        {profile && (
                            <Text type="secondary">
                                {profile.firstName} {profile.lastName}
                            </Text>
                        )}
                    </div>
                </Space>

                <Space align="center">
                    <Text type="secondary">Profondeur :</Text>
                    <Select
                        value={depth}
                        onChange={setDepth}
                        options={DEPTH_OPTIONS}
                        style={{ width: 160 }}
                    />
                </Space>
            </div>

            <Card style={{ borderRadius: 12 }}>
                <Tabs items={tabs} defaultActiveKey="ancestors" size="large" />
            </Card>
        </div>
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const TreePage: NextPage = () => (
    <ProtectedRoute>
        <TreeContent />
    </ProtectedRoute>
);

export default TreePage;
