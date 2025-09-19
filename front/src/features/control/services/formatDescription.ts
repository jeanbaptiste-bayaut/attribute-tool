export const formatDescription = (text: string) => {
  text = `${text}`;

  const html = text
    .replace(/__([^:]+):__/g, '<strong><u>$1:</u></strong>')
    .replace(/([^:\n]) ([A-Z][a-z]+:)/g, '$1<br />$2');

  html.replace(/__([^:]+):__/g, '<strong><u>$1:</u></strong>');

  const htmlOutput = '<pre>' + html + '</pre>';

  return htmlOutput;
};
