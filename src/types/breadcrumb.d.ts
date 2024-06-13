export type Breadcrumb = Array<BreadcrumbItem | never>;

export type BreadcrumbItem = {
  label: string;
  current: boolean;
  path: string;
}