import { describe, expect, it } from 'vitest';

import portfolioData from '@/data/portfolio.json';
import {
  filterProjects,
  findProjectBySlug,
  getAllCategories,
  getAllStackNames,
  getFeaturedProject,
  getPublishedProjects,
  sortProjects,
} from '@/lib/portfolio';
import type { PortfolioData, Project } from '@/types/portfolio';

const portfolio = portfolioData as PortfolioData;

describe('portfolio helpers', () => {
  it('sorts projects without mutating the original array', () => {
    const projects = [...portfolio.projects].reverse();

    const sorted = sortProjects(projects);

    expect(sorted.map((project) => project.order)).toEqual([1, 2, 3]);
    expect(projects.map((project) => project.order)).toEqual([3, 2, 1]);
  });

  it('returns only published projects', () => {
    const projects: Project[] = [
      ...portfolio.projects,
      {
        ...portfolio.projects[0],
        id: 'draft-project',
        slug: 'draft-project',
        published: false,
        featured: false,
        order: 4,
      },
    ];

    expect(getPublishedProjects(projects)).toHaveLength(3);
    expect(getPublishedProjects(projects).every((project) => project.published)).toBe(true);
  });

  it('returns the featured project', () => {
    expect(getFeaturedProject(portfolio.projects)?.slug).toBe('taskflow');
  });

  it('filters projects by stack and category', () => {
    expect(
      filterProjects(portfolio.projects, {
        stack: 'Next.js',
      }).map((project) => project.slug),
    ).toEqual(['taskflow']);

    expect(
      filterProjects(portfolio.projects, {
        category: 'community',
      }).map((project) => project.slug),
    ).toEqual(['redditlike']);
  });

  it('finds a published project by slug', () => {
    expect(findProjectBySlug(portfolio.projects, 'taskflow')?.title).toBe('TaskFlow');

    expect(findProjectBySlug(portfolio.projects, 'missing')).toBeUndefined();
  });

  it('returns unique stack names and categories', () => {
    const stackNames = getAllStackNames(portfolio.projects);
    const categories = getAllCategories(portfolio.projects);

    expect(new Set(stackNames).size).toBe(stackNames.length);
    expect(stackNames).toContain('TypeScript');
    expect(categories).toEqual(['community', 'media', 'workbench']);
  });
});
