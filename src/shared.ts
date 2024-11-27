export const titleIcons = [
  {
    title: "Urgent: Account Security",
    icon: "https://www.google.com/favicon.ico"
  },
  {
    title: "Password Reset Required",
    icon: "https://github.com/favicon.ico"
  },
  {
    title: "Document Shared With You",
    icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico"
  },
  // Add more title/icon combinations as needed
];

export function randomTitleAndIcon() {
  return titleIcons[Math.floor(Math.random() * titleIcons.length)];
} 