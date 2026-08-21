import type { PortfolioData, Project, ProjectCategory } from '@/types/portfolio';

export type ProjectFilters = {
  stack?: string;
  category?: ProjectCategory;
};

export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((first, second) => first.order - second.order);
}

export function getPublishedProjects(projects: Project[]): Project[] {
  return sortProjects(projects.filter((project) => project.published));
}

export function getFeaturedProject(projects: Project[]): Project | undefined {
  return getPublishedProjects(projects).find((project) => project.featured);
}

export function filterProjects(projects: Project[], filters: ProjectFilters): Project[] {
  return getPublishedProjects(projects).filter((project) => {
    const matchesStack = !filters.stack || project.stack.includes(filters.stack);

    const matchesCategory = !filters.category || project.category === filters.category;

    return matchesStack && matchesCategory;
  });
}

export function findProjectBySlug(projects: Project[], slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug && project.published);
}

export function getProjectById(projects: Project[], id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getAllStackNames(projects: Project[]): string[] {
  return Array.from(new Set(projects.flatMap((project) => project.stack))).sort((first, second) =>
    first.localeCompare(second),
  );
}

export function getAllCategories(projects: Project[]): ProjectCategory[] {
  return Array.from(new Set(projects.map((project) => project.category))).sort();
}

export function getPublicPortfolio(portfolio: PortfolioData): PortfolioData {
  return {
    ...portfolio,
    projects: getPublishedProjects(portfolio.projects),
  };
}
