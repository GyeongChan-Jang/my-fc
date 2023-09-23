import { useEffect } from 'react';

interface PDFPrintProps {
  print: boolean;
  onAfterPrint: () => void;
  children: React.ReactNode;
}

const PDFPrint: React.FC<PDFPrintProps> = ({ print, onAfterPrint, children }) => {
  function addStylesheetRules(frame: HTMLIFrameElement, rules?: CSSRuleList) {
    const style = document.createElement('style');

    // Append <style> element to <head>
    frame.contentWindow?.document.head.append(style);

    // Grab style element's sheet
    const styleSheet = style.sheet;
    if (styleSheet === null || !rules) return;
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      // Insert CSS Rule
      styleSheet.insertRule(rule.cssText, i);
    }
  }

  useEffect(() => {
    if (print) {
      const frame = document.getElementsByName('printFrame')[0] as HTMLIFrameElement;
      const sheets = document.styleSheets;
      const styles = document.querySelectorAll('style');
      styles.forEach((el, i) => {
        if (!el.innerText) {
          addStylesheetRules(frame, sheets.item(i)?.cssRules);
        } else {
          const cloneEl = el.cloneNode(true);
          frame.contentWindow?.document.head.append(cloneEl);
        }
      });

      const content = document.getElementById('printContent');
      if (content) frame.contentWindow?.document.body.append(content);

      window.frames['printFrame' as unknown as number].print();

      onAfterPrint();
    }
  }, [print]);

  if (!print) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: -999 }}>
      <iframe name="printFrame" style={{ display: 'none', width: '1280px', height: '1920px' }} />
      <div style={{ opacity: 0 }}>
        <div id="printContent">{children}</div>
      </div>
    </div>
  );
};

export default PDFPrint;
