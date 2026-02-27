import type { AncestorNode, DescendantNode } from '../types';
import type { Profile } from '../../profiles/types';

/**
 * Aplatit l'arbre des ancêtres en une liste de profils.
 */
export const flattenAncestors = (node: AncestorNode | null): Profile[] => {
    if (!node) return [];
    return [
        node.profile,
        ...flattenAncestors(node.father),
        ...flattenAncestors(node.mother),
    ];
};

/**
 * Aplatit l'arbre des descendants en une liste de profils.
 */
export const flattenDescendants = (node: DescendantNode | null): Profile[] => {
    if (!node) return [];
    return [
        node.profile,
        ...node.children.flatMap((child) => flattenDescendants(child)),
    ];
};

/**
 * Compte le nombre total de générations dans un arbre d'ancêtres.
 */
export const countAncestorGenerations = (node: AncestorNode | null): number => {
    if (!node) return 0;
    return 1 + Math.max(
        countAncestorGenerations(node.father),
        countAncestorGenerations(node.mother),
    );
};

/**
 * Compte le nombre total de générations dans un arbre de descendants.
 */
export const countDescendantGenerations = (node: DescendantNode | null): number => {
    if (!node) return 0;
    if (node.children.length === 0) return 1;
    return 1 + Math.max(...node.children.map((child) => countDescendantGenerations(child)));
};
