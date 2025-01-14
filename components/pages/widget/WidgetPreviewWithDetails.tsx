'use client';

import WidgetDetails from '@/components/WidgetDetails/WidgetDetails';
import WidgetPreview from '@/components/WidgetPreview/WidgetPreview';
import clientOnly from '@/utils/clientOnly';
import { LibraryItem } from '@/utils/types/config';
import * as RuiTabs from '@radix-ui/react-tabs';
import ClipboardCheckIcon from 'bootstrap-icons/icons/clipboard-check-fill.svg';
import ClipboardIcon from 'bootstrap-icons/icons/clipboard.svg';
import CodeSlashIcon from 'bootstrap-icons/icons/code-slash.svg';
import MarkdownIcon from 'bootstrap-icons/icons/markdown.svg';
import TwitterIcon from 'bootstrap-icons/icons/twitter.svg';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { Highlight, themes } from 'prism-react-renderer';
import { useCallback, useState } from 'react';
import './style.scss';

interface WidgetPreviewWithDetailsProps {
  item: LibraryItem;
}

function WidgetPreviewWithDetails ({ item }: WidgetPreviewWithDetailsProps) {
  const { showBorder, ...props } = item.props;
  const pathname = usePathname();
  const url = `${location.origin}${pathname}`;

  return (
    <div className="flex mx-auto max-w-[480px] flex-col gap-2 justify-center items-stretch p-2 overflow-hidden">
      <Url title={item.props.title ?? ''} url={url} />
      <div className="w-full min-h-[320px] max-h-[320px] flex-1 flex flex-col">
        <WidgetPreview id={item.id} name={item.name} props={item.props} />
      </div>
      <div className="w-full min-h-[240px] max-h-[240px] flex-1 flex flex-col overflow-hidden">
        <WidgetDetails id={item.id} name={item.name} props={item.props} />
        <RuiTabs.Root defaultValue="markdown" className="my-4">
          <RuiTabs.List className="share-tabs-list">
            <RuiTabs.Trigger className="share-tabs-list-item" value="markdown">
              <MarkdownIcon />
              Markdown
            </RuiTabs.Trigger>
            <RuiTabs.Trigger className="share-tabs-list-item" value="html">
              <CodeSlashIcon />
              HTML
            </RuiTabs.Trigger>
          </RuiTabs.List>
          <RuiTabs.Content value="markdown" className="relative">
            <Code code={createMarkdownCode(item.props.title ?? 'OSSInsight Lite unnamed widget', url)} language={'markdown'} />
          </RuiTabs.Content>
          <RuiTabs.Content value="html" className="relative">
            <Code code={createHtmlCode(item.props.title ?? 'OSSInsight Lite unnamed widget', url)} language={'html'} />
          </RuiTabs.Content>
        </RuiTabs.Root>
      </div>
    </div>
  );
}

function Url ({ title, url }: { title: string, url: string }) {
  return (
    <div className="max-w-[480px] w-full border bg-gray-200 rounded text-sm text-gray-700 px-2 py-1 flex items-center justify-between gap-2">
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        {url}
      </span>
      <span className="flex gap-2 items-center">
        <a className="btn btn-sm btn-link" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank">
          <TwitterIcon />
        </a>
      </span>
    </div>
  );
}

function createMarkdownCode (title: string, url: string): string {
  return `
## ${title}

[![${title}](${url}/thumbnail.png)](${url})
`;
}

function createHtmlCode (title: string, url: string): string {
  return `
<a href="${url}" target="_blank">
  <img src="${url}/thumbnail.png" alt=${JSON.stringify(title)}>
</a>
`;
}

function Code ({ code, language }: { code: string, language: string }) {
  return (
    <Highlight
      theme={themes.github}
      code={code}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className={clsx('p-2 text-xs rounded overflow-auto', className)} style={style}>
          <span className="block absolute right-2 top-2 bg-white rounded border opacity-60 hover:opacity-100 transition-opacity">
            <CopyButton value={code} />
          </span>
          <pre style={style}>
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        </div>
      )}
    </Highlight>
  );
}

function CopyButton ({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    setCopied(false);
    navigator.clipboard.writeText(value)
      .then(() => {
        setCopied(true);
      });
  }, [value]);

  return (
    <button onClick={handleCopy} className="btn btn-sm btn-link">
      {copied ? <ClipboardCheckIcon className="text-green-500" /> : <ClipboardIcon />}
    </button>
  );
}

export default clientOnly(WidgetPreviewWithDetails);
