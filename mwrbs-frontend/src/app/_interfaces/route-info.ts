export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    group: MenuGroup;
}

export class MenuGroup {
  static readonly admin = 1;
  static readonly maintenance = 2;
  static readonly report = 3;
  static readonly client = 4;
}

