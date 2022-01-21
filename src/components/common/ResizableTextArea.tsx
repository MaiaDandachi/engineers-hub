import React, { useEffect, useRef } from 'react';

interface IResizableTextAreaProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ResizableTextArea: React.FC<IResizableTextAreaProps> = ({ id, value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.overflow = 'hidden';
      textareaRef.current.style.height = '0px';
      const { scrollHeight } = textareaRef.current;
      textareaRef.current.style.height = `${scrollHeight}px`;

      const heightValueWithNoPx = Number(textareaRef.current.style.height.slice(0, -2));
      // show scrollbar after this height
      if (heightValueWithNoPx > 256) {
        textareaRef.current.style.overflow = 'auto';
      }
    }
  }, [value, textareaRef.current?.scrollHeight]);

  return (
    <textarea
      id={id}
      ref={textareaRef}
      className='auth-card__input overflow-hidden resize-none max-h-64'
      value={value}
      onChange={onChange}
    />
  );
};
