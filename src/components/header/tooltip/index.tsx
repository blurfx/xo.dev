import * as Tooltip from '@radix-ui/react-tooltip';
import React from 'react';

import { TooltipContent } from './styles';

type Props = React.PropsWithChildren<{
  label: string;
}>;

const TooltipWrapper = ({ label, children }: Props) => {
  return (
    <Tooltip.Provider delayDuration={50}>
      <Tooltip.Root>
        <Tooltip.Trigger>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <TooltipContent side='bottom' sideOffset={5}>
            {label}
          </TooltipContent>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default TooltipWrapper;
