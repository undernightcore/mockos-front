export function angularTemplate(projectId: number, backUrl: string) {
  return `{
  "*": {
    "target": "${backUrl}/api",
    "secure": false,
    "headers": {
      "project": "${projectId}",
      "authorization": "Bearer <your-token-here>"
    },
    "logLevel": "debug",
    "changeOrigin": true
  }
}`;
}
