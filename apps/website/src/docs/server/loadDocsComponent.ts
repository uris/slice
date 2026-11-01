// import 'server-only';
//
// import type { ComponentType } from 'react';
// import { type DocPageModule, isDocSlug } from '../registry/slugs';
//
// // load project details based on slug passed as parameter
// export async function loadDocPageComponent(slug: string): Promise<ComponentType | null> {
// 	// protect for valid slug
// 	if (!isDocSlug(slug)) return null;
//
// 	// dynamically load the doc details module for the corresponding slug, returning the default export or null if there is none
// 	const loadDocPageModule = (): Promise<DocPageModule> => import(`@/projects/content/${slug}/projectDetails`);
// 	const module = await loadProjectModule();
// 	return module.default ? module.default : null;
// }
