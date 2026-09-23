export function demoResponse(context: string | null) {
  const subject = context ?? 'Workspace';
  return `## ${subject} overview\n\n- **Overview:** The main idea and its supporting context.\n  Keep the relevant section in view as you work.\n- **Notes:** Questions, observations, and next steps.\n  Select an area to bring it into focus.\n- **Connections:** How the different pieces relate.\n  Move this conversation alongside the selected content.\n\n### Next steps\n- Review the selected area.\n- Add your next question.\n\nLocal sample — no AI provider is connected.`;
}
