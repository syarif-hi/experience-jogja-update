import treeData from "@/data/content-tree.json";

export const VISITOR_INFO_TREE = treeData;

/**
 * Finds a node by matching its slug path.
 * The path should be an array of slugs, e.g. ["getting-to-jogja", "airports", "yogyakarta-international-airport-yia"]
 */
export function findNodeByPath(slugs) {
  if (!slugs || slugs.length === 0) return VISITOR_INFO_TREE;

  let current = VISITOR_INFO_TREE;
  for (const slug of slugs) {
    if (!current.children) return null; // path goes deeper but no children
    const match = current.children.find((child) => child.slug === slug);
    if (!match) return null;
    current = match;
  }
  return current;
}

/**
 * Returns an array of ancestor nodes including the target node itself.
 * For example, if path is ["getting-to-jogja", "airports"], returns [hubNode, gettingToJogjaNode, airportsNode]
 */
export function getBreadcrumbTrail(slugs) {
  const trail = [VISITOR_INFO_TREE];
  if (!slugs || slugs.length === 0) return trail;

  let current = VISITOR_INFO_TREE;
  for (const slug of slugs) {
    if (!current.children) break;
    const match = current.children.find((child) => child.slug === slug);
    if (!match) break;
    trail.push(match);
    current = match;
  }
  return trail;
}

/**
 * Returns siblings of a node.
 * For the hub, returns its children (top-level categories).
 * For deeper nodes, returns children of its parent.
 */
export function getSiblings(slugs) {
  if (!slugs || slugs.length === 0) return VISITOR_INFO_TREE.children || [];
  
  const parentSlugs = slugs.slice(0, -1);
  const parent = findNodeByPath(parentSlugs);
  return parent ? (parent.children || []) : [];
}

/**
 * Helper to get the localized string
 */
export function getLocalizedString(localizedObj, lang = "en") {
  if (!localizedObj) return "";
  return localizedObj[lang] || localizedObj["en"] || "";
}

/**
 * Helper to build the full path string for a node given its ancestor slugs
 */
export function buildPath(slugs) {
  if (!slugs || slugs.length === 0) return "/visitor-information";
  return `/visitor-information/${slugs.join("/")}`;
}
