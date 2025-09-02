export class routes {
  private static Url = '';
  public static get baseUrl(): string {
    return this.Url;
  }
  public static get pasar(): string {
    return this.baseUrl + '/seg-menuprincipal/seg-menuprincipal';
  }
}