import { ApartmentOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Empty, Input, Space, Spin, Statistic, Tag, Tooltip, Typography } from 'antd';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { ProfileNode } from '@/domains/profiles/types';
import { useFamilyGraph } from '@/domains/profiles/useProfiles';

import styles from './profiles/[id]/tree.module.scss';

const { Title, Text } = Typography;

// ─── Layout constants (shared with individual tree) ───────────────────────────
const NW = 168;
const NH = 70;
const HG = 28;
const VG = 70;
const PAD = 48;

// ─── Layout types ─────────────────────────────────────────────────────────────
interface NodeLayout {
    node: ProfileNode;
    x: number;
    y: number;
    gen: number;
}

interface EdgeLayout {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

interface GlobalLayout {
    nodes: NodeLayout[];
    edges: EdgeLayout[];
    w: number;
    h: number;
}

// ─── Generation computation ───────────────────────────────────────────────────
// Generation 0 = oldest ancestors (no known parents).
// Each person's generation = max(parent generations) + 1.
// After the initial DFS pass, we run an iterative convergence that:
//   1. Aligns spouses (inferred from shared children) to the same generation.
//   2. Re-pushes children below their parents if a parent's gen was lifted.
// This prevents a spouse with no known parents from being stuck at gen=0
// while their partner is at gen=1 or higher.
function computeGenerations(nodes: ProfileNode[]): Map<number, number> {
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const genMap = new Map<number, number>();
    const visiting = new Set<number>();

    function gen(id: number): number {
        if (genMap.has(id)) return genMap.get(id)!;
        if (visiting.has(id)) { genMap.set(id, 0); return 0; } // cycle guard
        visiting.add(id);
        const n = byId.get(id)!;
        let g = 0;
        if (n.fatherId && byId.has(n.fatherId)) g = Math.max(g, gen(n.fatherId) + 1);
        if (n.motherId && byId.has(n.motherId)) g = Math.max(g, gen(n.motherId) + 1);
        visiting.delete(id);
        genMap.set(id, g);
        return g;
    }

    nodes.forEach((n) => gen(n.id));

    // Iterative convergence: align spouses + push children below parents.
    let changed = true;
    while (changed) {
        changed = false;
        // Step 1 – spouses share the same generation (take the max of the two).
        nodes.forEach((child) => {
            if (!child.fatherId || !child.motherId) return;
            if (!byId.has(child.fatherId) || !byId.has(child.motherId)) return;
            const gf = genMap.get(child.fatherId)!;
            const gm = genMap.get(child.motherId)!;
            const target = Math.max(gf, gm);
            if (gf !== target) { genMap.set(child.fatherId, target); changed = true; }
            if (gm !== target) { genMap.set(child.motherId, target); changed = true; }
        });
        // Step 2 – each child must be strictly below both parents.
        nodes.forEach((n) => {
            let g = genMap.get(n.id)!;
            if (n.fatherId && genMap.has(n.fatherId)) {
                const need = genMap.get(n.fatherId)! + 1;
                if (need > g) { g = need; changed = true; }
            }
            if (n.motherId && genMap.has(n.motherId)) {
                const need = genMap.get(n.motherId)! + 1;
                if (need > g) { g = need; changed = true; }
            }
            genMap.set(n.id, g);
        });
    }

    return genMap;
}

// ─── Global layout ─────────────────────────────────────────────────────────────
// Each generation occupies one horizontal row.
// Nodes within a row are ordered by average parent position to keep
// children roughly below their parents and minimise edge crossings.
// Each row is centered in the overall canvas width.
function buildGlobalLayout(nodes: ProfileNode[]): GlobalLayout {
    if (!nodes.length) return { nodes: [], edges: [], w: 600, h: 300 };

    const byId = new Map(nodes.map((n) => [n.id, n]));
    const genMap = computeGenerations(nodes);
    const maxGen = Math.max(...genMap.values(), 0);

    // Group nodes by generation
    const byGen = new Map<number, ProfileNode[]>();
    nodes.forEach((n) => {
        const g = genMap.get(n.id)!;
        if (!byGen.has(g)) byGen.set(g, []);
        byGen.get(g)!.push(n);
    });

    // For each generation, sort by average parent position (already sorted
    // generations above provide stable parent positions) then alphabetically.
    const posInGen = new Map<number, number>(); // id → index within row

    for (let g = 0; g <= maxGen; g++) {
        const row = byGen.get(g) ?? [];
        row.sort((a, b) => {
            const pa = avgParentPos(a, posInGen, byId);
            const pb = avgParentPos(b, posInGen, byId);
            if (pa !== pb) return pa - pb;
            return (a.lastName ?? '').localeCompare(b.lastName ?? '');
        });
        row.forEach((n, i) => posInGen.set(n.id, i));
    }

    const maxCols = Math.max(...Array.from(byGen.values()).map((r) => r.length), 1);
    const canvasW = maxCols * (NW + HG) - HG + 2 * PAD;

    // Pixel positions: center each row horizontally in the canvas
    const layoutNodes: NodeLayout[] = nodes.map((n) => {
        const g = genMap.get(n.id)!;
        const pos = posInGen.get(n.id)!;
        const rowCount = (byGen.get(g) ?? []).length;
        const rowOffset = ((maxCols - rowCount) * (NW + HG)) / 2;
        return {
            node: n,
            x: rowOffset + pos * (NW + HG) + PAD,
            y: g * (NH + VG) + PAD,
            gen: g,
        };
    });

    const nodePixels = new Map(layoutNodes.map((ln) => [ln.node.id, ln]));

    // Edges: child top-center → parent bottom-center
    const edges: EdgeLayout[] = [];
    layoutNodes.forEach((ln) => {
        [ln.node.fatherId, ln.node.motherId].forEach((pid) => {
            if (!pid || !nodePixels.has(pid)) return;
            const parent = nodePixels.get(pid)!;
            edges.push({
                x1: ln.x + NW / 2,
                y1: ln.y,
                x2: parent.x + NW / 2,
                y2: parent.y + NH,
            });
        });
    });

    return {
        nodes: layoutNodes,
        edges,
        w: Math.max(canvasW, 600),
        h: Math.max((maxGen + 1) * (NH + VG) - VG + 2 * PAD, 300),
    };
}

function avgParentPos(
    n: ProfileNode,
    posInGen: Map<number, number>,
    byId: Map<number, ProfileNode>,
): number {
    const pids = [n.fatherId, n.motherId].filter(
        (pid): pid is number => pid != null && byId.has(pid) && posInGen.has(pid),
    );
    if (!pids.length) return 0;
    return pids.reduce((s, pid) => s + posInGen.get(pid)!, 0) / pids.length;
}

// ─── SVG Export ───────────────────────────────────────────────────────────────
function exportGlobalTreeAsSvg(layout: GlobalLayout, filename: string) {
    const FONT = 'system-ui, sans-serif';
    const MALE_COLOR = '#3b82f6';
    const FEMALE_COLOR = '#ec4899';
    const NODE_BG = '#fffaf3';
    const NODE_BORDER = '#edd9bc';
    const EDGE_COLOR = '#c4956a';

    const rects = layout.nodes.map(({ node, x, y }) => {
        const genderColor = node.gender === 'MALE' ? MALE_COLOR : FEMALE_COLOR;
        const birthYear = node.dateOfBirth ? new Date(node.dateOfBirth).getFullYear() : '?';
        const deathYear = node.dateOfDeath ? new Date(node.dateOfDeath).getFullYear() : null;
        const dates = deathYear ? `${birthYear} – ${deathYear}` : String(birthYear);
        const name = [node.firstName, node.lastName].filter(Boolean).join(' ') || '?';
        return `
  <rect x="${x}" y="${y}" width="${NW}" height="${NH}" rx="8"
        fill="${NODE_BG}" stroke="${NODE_BORDER}" stroke-width="1"/>
  <rect x="${x}" y="${y}" width="${NW}" height="4" rx="4" fill="${genderColor}"/>
  <text x="${x + NW / 2}" y="${y + 28}" text-anchor="middle"
        font-family="${FONT}" font-size="12" font-weight="600" fill="#1a0d06">${name}</text>
  <text x="${x + NW / 2}" y="${y + 48}" text-anchor="middle"
        font-family="${FONT}" font-size="11" fill="#888">${dates}</text>`;
    }).join('');

    const paths = layout.edges.map((e) => {
        const midY = (e.y1 + e.y2) / 2;
        return `<path d="M ${e.x1},${e.y1} C ${e.x1},${midY} ${e.x2},${midY} ${e.x2},${e.y2}"
      fill="none" stroke="${EDGE_COLOR}" stroke-width="1.5"/>`;
    }).join('');

    const svg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${layout.w}" height="${layout.h}">
  <rect width="${layout.w}" height="${layout.h}" fill="#fdf4e8"/>
  ${paths}
  ${rects}
</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ─── Tree renderer ────────────────────────────────────────────────────────────
interface SvgGlobalTreeProps {
    layout: GlobalLayout;
    matchedIds: Set<number> | null;
    focusId: number | null;
}

const SvgGlobalTree = ({ layout, matchedIds, focusId }: SvgGlobalTreeProps) => {
    const router = useRouter();
    const hasSearch = matchedIds !== null;

    return (
        <div className={styles.treeScroll}>
            <div className={styles.treeCanvas} style={{ width: layout.w, height: layout.h }}>
                {/* Edges */}
                <svg
                    width={layout.w}
                    height={layout.h}
                    style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                >
                    {layout.edges.map((e, i) => {
                        const midY = (e.y1 + e.y2) / 2;
                        const d = `M ${e.x1},${e.y1} C ${e.x1},${midY} ${e.x2},${midY} ${e.x2},${e.y2}`;
                        return (
                            <path
                                key={i}
                                d={d}
                                pathLength={1}
                                className={styles.treePath}
                                fill="none"
                                stroke="#c4956a"
                                strokeWidth={1.5}
                            />
                        );
                    })}
                </svg>

                {/* Nodes */}
                {layout.nodes.map(({ node, x, y, gen }) => {
                    const isMatch = !hasSearch || matchedIds!.has(node.id);
                    const isFocus = focusId === node.id;
                    const birthYear = node.dateOfBirth ? new Date(node.dateOfBirth).getFullYear() : '?';
                    const deathYear = node.dateOfDeath ? new Date(node.dateOfDeath).getFullYear() : null;
                    const name = [node.firstName, node.lastName].filter(Boolean).join(' ') || '?';

                    return (
                        <div
                            key={node.id}
                            className={`${styles.treeNode} ${isFocus ? styles.rootNode : ''}`}
                            style={{
                                left: x,
                                top: y,
                                width: NW,
                                height: NH,
                                animationDelay: `${Math.min(gen * 50, 400)}ms`,
                                opacity: isMatch ? undefined : 0.18,
                                transition: 'opacity 0.25s ease',
                            }}
                            onClick={() => router.push(`/profiles/${node.id}`)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') router.push(`/profiles/${node.id}`);
                            }}
                        >
                            <div className={styles.genderBar} data-gender={node.gender ?? 'UNKNOWN'} />
                            <div className={styles.nodeContent}>
                                <Tooltip title={`Voir le profil de ${name}`}>
                                    <div className={styles.nodeName}>{name}</div>
                                </Tooltip>
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

// ─── Page content ─────────────────────────────────────────────────────────────
const GlobalTreeContent = () => {
    const { data: rawNodes = [], isLoading } = useFamilyGraph();
    const [search, setSearch] = useState('');

    // Filter out empty profiles (no name, no dates) — these are auto-created
    // placeholders not yet filled in by the user
    const nodes = useMemo(
        () => rawNodes.filter((n) => n.firstName || n.dateOfBirth),
        [rawNodes],
    );

    const layout = useMemo(() => buildGlobalLayout(nodes), [nodes]);

    const searchTrimmed = search.trim().toLowerCase();
    const matchedIds = searchTrimmed
        ? new Set(
              nodes
                  .filter(
                      (n) =>
                          n.firstName?.toLowerCase().includes(searchTrimmed) ||
                          n.lastName?.toLowerCase().includes(searchTrimmed),
                  )
                  .map((n) => n.id),
          )
        : null;

    // Node focused when there is exactly one match
    const focusId = matchedIds?.size === 1 ? [...matchedIds][0]! : null;

    // Generation stats
    const genMap = useMemo(() => computeGenerations(nodes), [nodes]);
    const genCount = new Set(genMap.values()).size;
    const connectedCount = nodes.filter((n) => n.fatherId || n.motherId).length;

    return (
        <div>
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 24,
                }}
            >
                <div>
                    <Space align="center" style={{ marginBottom: 4 }}>
                        <ApartmentOutlined style={{ fontSize: 22, color: '#e67e22' }} />
                        <Title level={3} style={{ margin: 0 }}>
                            Arbre généalogique global
                        </Title>
                    </Space>
                    <Text type="secondary">Vue d'ensemble de toute la famille</Text>
                </div>

                <Button
                    icon={<DownloadOutlined />}
                    disabled={!layout.nodes.length}
                    onClick={() => exportGlobalTreeAsSvg(layout, 'arbre-global.svg')}
                >
                    Exporter SVG
                </Button>
            </div>

            {/* Stats */}
            {nodes.length > 0 && (
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                    <div
                        style={{
                            background: '#fff7ed',
                            border: '1px solid #edd9bc',
                            borderRadius: 8,
                            padding: '12px 24px',
                        }}
                    >
                        <Statistic title="Profils" value={nodes.length} />
                    </div>
                    <div
                        style={{
                            background: '#fff7ed',
                            border: '1px solid #edd9bc',
                            borderRadius: 8,
                            padding: '12px 24px',
                        }}
                    >
                        <Statistic title="Générations" value={genCount} />
                    </div>
                    <div
                        style={{
                            background: '#fff7ed',
                            border: '1px solid #edd9bc',
                            borderRadius: 8,
                            padding: '12px 24px',
                        }}
                    >
                        <Statistic title="Avec liens familiaux" value={connectedCount} />
                    </div>
                </div>
            )}

            {/* Search */}
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Rechercher une personne dans l'arbre..."
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                    style={{ maxWidth: 360 }}
                />
                {matchedIds !== null && (
                    <Tag
                        color={matchedIds.size > 0 ? 'orange' : 'default'}
                        style={{ marginLeft: 8 }}
                    >
                        {matchedIds.size} résultat{matchedIds.size !== 1 ? 's' : ''}
                    </Tag>
                )}
            </div>

            {/* Tree */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: 80 }}>
                    <Spin size="large" />
                </div>
            ) : nodes.length === 0 ? (
                <Empty
                    description="Aucun profil avec des liens familiaux"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <SvgGlobalTree layout={layout} matchedIds={matchedIds} focusId={focusId} />
            )}
        </div>
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const GlobalTreePage: NextPage = () => (
    <ProtectedRoute>
        <GlobalTreeContent />
    </ProtectedRoute>
);

export default GlobalTreePage;
