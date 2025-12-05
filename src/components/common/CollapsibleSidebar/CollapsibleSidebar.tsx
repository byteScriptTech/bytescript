import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const MAX_LABEL_LENGTH = 28;
const truncateLabel = (text: string, maxLength = MAX_LABEL_LENGTH) =>
  text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;

export type SidebarItem = {
  id: string;
  name: string;
  icon?: ReactNode;
  children?: SidebarItem[];
  onClick?: () => void;
  isActive?: boolean;
  showChildren?: boolean;
};

interface CollapsibleSidebarProps {
  items: SidebarItem[];
  header?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  isMobile?: boolean;
  collapsible?: boolean;
  onItemClick?: (item: SidebarItem) => void;
  activeItemId?: string | null;
  activeChildId?: string | null;
}

function CollapsibleSidebar({
  items,
  header,
  defaultOpen = true,
  className,
  isMobile = false,
  collapsible = true,
  onItemClick,
  activeItemId,
  activeChildId,
}: CollapsibleSidebarProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeItem, setActiveItem] = useState<string | null>(
    activeItemId || null
  );
  const [activeChild, setActiveChild] = useState<string | null>(
    activeChildId || null
  );

  useEffect(() => {
    setActiveItem(activeItemId || null);
  }, [activeItemId]);

  useEffect(() => {
    setActiveChild(activeChildId || null);
  }, [activeChildId]);

  const handleItemClick = (item: SidebarItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setActiveItem(item.id);
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const handleChildClick = (child: SidebarItem, parentId: string) => {
    setActiveItem(parentId);
    setActiveChild(child.id);
    if (child.onClick) {
      child.onClick();
    }
  };
  console.log(isMobile, 'isMobile');
  return (
    <div
      id="collapsible-sidebar"
      className={cn(
        'fixed inset-y-0 left-0 z-50 border-r bg-background transition-transform duration-300 ease-in-out md:relative md:z-40',
        collapsible ? 'w-72' : 'w-64',
        !isOpen && collapsible && '-translate-x-full md:translate-x-0 md:w-20',
        'flex flex-col h-full shadow-lg md:shadow-none',
        isMobile ? 'w-4/5 max-w-xs' : '',
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b h-16">
        {isOpen ? (
          <h2 className="text-lg font-semibold">{header || 'Menu'}</h2>
        ) : (
          <div className="w-6" aria-hidden="true" />
        )}
        {collapsible && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'ml-auto transition-opacity',
              !isOpen && 'opacity-0 md:opacity-100'
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {items?.map((item) => {
            const isItemTruncated = item.name.length > MAX_LABEL_LENGTH;
            return (
              <div key={item.id} className="space-y-1">
                {!isOpen && !isMobile ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`justify-center px-0 w-10 h-10 rounded-full mx-auto text-foreground ${
                            activeItem === item.id
                              ? 'bg-teal-lighter text-secondary hover:bg-teal-light'
                              : 'hover:bg-accent/50'
                          }`}
                          onClick={() => handleItemClick(item)}
                        >
                          {item.icon || (
                            <span className="text-sm font-medium">
                              {item.name.charAt(0)}
                            </span>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={10}>
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    {isItemTruncated ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className={`flex-1 justify-start text-left ${
                                activeItem === item.id
                                  ? 'bg-teal-lighter text-secondary hover:bg-teal-light'
                                  : 'hover:bg-accent'
                              }`}
                              onClick={() => handleItemClick(item)}
                            >
                              {item.icon && (
                                <span className="mr-2">{item.icon}</span>
                              )}
                              {truncateLabel(item.name)}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right" sideOffset={10}>
                            <p>{item.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Button
                        variant="ghost"
                        className={`flex-1 justify-start text-left ${
                          activeItem === item.id
                            ? 'bg-teal-lighter text-secondary hover:bg-teal-light'
                            : 'hover:bg-accent'
                        }`}
                        onClick={() => handleItemClick(item)}
                      >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {truncateLabel(item.name)}
                      </Button>
                    )}
                  </div>
                )}
                {activeItem === item.id &&
                  item.children &&
                  item.children.length > 0 &&
                  (isOpen || isMobile) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const isChildTruncated =
                          child.name.length > MAX_LABEL_LENGTH;
                        const childButton = (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start ${
                              activeChild === child.id
                                ? 'bg-teal-lighter text-secondary hover:bg-teal-light'
                                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                            }`}
                            onClick={() => handleChildClick(child, item.id)}
                          >
                            {child.icon && (
                              <span className="mr-2">{child.icon}</span>
                            )}
                            {truncateLabel(child.name)}
                          </Button>
                        );

                        return isChildTruncated ? (
                          <TooltipProvider key={child.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                {childButton}
                              </TooltipTrigger>
                              <TooltipContent side="right" sideOffset={10}>
                                <p>{child.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <div key={child.id}>{childButton}</div>
                        );
                      })}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export { CollapsibleSidebar as default };
