import { useCallback, useState } from "react";
import { CheckCircleIcon, ClipboardIcon } from "@heroicons/react/24/outline";

interface CopyToClipboardProps {
  code: string;
  language: string;
}

export function CopyCodeToClipboard({
  code,
  language
}: CopyToClipboardProps): React.JSX.Element {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [code]);

  return <div
    className="absolute flex flex-row top-0 right-0 p-2">
    <span className='m-1 pb-1 basis-3/4 text-xs'>{language}</span>
    <div 
      onClick={copy}
      className="cursor-pointer"
    >
      {copied ? 
        <CheckCircleIcon className="text-lg m-1 w-5 h-5 text-green-500" />
        :   
        <ClipboardIcon className="text-lg m-1 w-5 h-5 hover:text-white" />
      }
    </div>
  </div>;
}