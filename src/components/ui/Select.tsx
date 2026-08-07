import {
  Children,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { FaChevronDown } from "react-icons/fa";
import type {
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
  OptionHTMLAttributes,
  ReactElement,
  SelectHTMLAttributes,
} from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  options?: SelectOption[];
  className?: string;
  selectClassName?: string;
  variant?: "md" | "sm";
}

const SIZE_CLASSES: Record<NonNullable<SelectProps["variant"]>, string> = {
  md: "rounded-xl px-4 py-2.5 text-sm",
  sm: "rounded-lg px-3 py-1.5 text-xs",
};

const POPUP_EST_HEIGHT = 240;
const POPUP_MIN_HEIGHT = 120;
const POPUP_MIN_WIDTH = 180;

const normalize = (value: unknown): string =>
  value === undefined || value === null ? "" : String(value);

interface PopupCoords {
  top: number;
  left: number;
  minWidth: number;
  maxWidth: number;
  maxHeight: number;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      children,
      className = "",
      selectClassName = "",
      variant = "md",
      value,
      defaultValue,
      onChange,
      disabled,
      name,
      id,
      "aria-label": ariaLabel,
      ...rest
    },
    ref
  ) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLUListElement>(null);
    const [open, setOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [coords, setCoords] = useState<PopupCoords | null>(null);
    const [selected, setSelected] = useState<string>(() =>
      normalize(value !== undefined ? value : defaultValue)
    );
    const generatedId = useId();

    const items: SelectOption[] = options
      ? options
      : Children.toArray(children)
          .filter(
            (
              child
            ): child is ReactElement<OptionHTMLAttributes<HTMLOptionElement>> =>
              isValidElement<OptionHTMLAttributes<HTMLOptionElement>>(child)
          )
          .map((child) => ({
            value: normalize(child.props.value),
            label: String(child.props.children ?? ""),
            disabled: Boolean(child.props.disabled),
          }));

    const current = items.find((item) => item.value === selected) ?? null;

    const setSelectRef = (element: HTMLSelectElement | null): void => {
      (selectRef as { current: HTMLSelectElement | null }).current = element;
      if (typeof ref === "function") ref(element);
      else if (ref) {
        (ref as { current: HTMLSelectElement | null }).current = element;
      }
    };

    // Mirror the DOM value back into state when it changes externally
    // (e.g. react-hook-form sets the native select value on mount/reset).
    useEffect(() => {
      if (value === undefined && selectRef.current) {
        const domValue = normalize(selectRef.current.value);
        if (domValue !== selected) setSelected(domValue);
      }
    });

    // A controlled `value` prop wins over the DOM.
    useEffect(() => {
      if (value !== undefined) setSelected(normalize(value));
    }, [value]);

    // Keep the hidden native select in sync so forms/submits read the right value.
    useEffect(() => {
      if (selectRef.current && selectRef.current.value !== selected) {
        selectRef.current.value = selected;
      }
    }, [selected]);

    // Close when a pointer lands outside the widget, when focus leaves it,
    // or when the page scrolls/resizes while the menu is open.
    useEffect(() => {
      if (!open) return;
      const handlePointerDown = (event: MouseEvent): void => {
        const target = event.target as Node;
        if (
          !rootRef.current?.contains(target) &&
          !popupRef.current?.contains(target)
        ) {
          setOpen(false);
        }
      };
      const handleFocusIn = (event: Event): void => {
        const target = event.target as Node;
        if (
          !rootRef.current?.contains(target) &&
          !popupRef.current?.contains(target)
        ) {
          setOpen(false);
        }
      };
      const handleViewportChange = (): void => setOpen(false);
      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("focusin", handleFocusIn);
      window.addEventListener("scroll", handleViewportChange, true);
      window.addEventListener("resize", handleViewportChange);
      return () => {
        document.removeEventListener("mousedown", handlePointerDown);
        document.removeEventListener("focusin", handleFocusIn);
        window.removeEventListener("scroll", handleViewportChange, true);
        window.removeEventListener("resize", handleViewportChange);
      };
    }, [open]);

    // Focus the highlighted option when the menu opens or focus moves.
    useEffect(() => {
      if (!open || focusedIndex < 0) return;
      const optionButtons = popupRef.current?.querySelectorAll(
        "[role='option']"
      );
      (optionButtons?.[focusedIndex] as HTMLElement | undefined)?.focus();
    }, [open, focusedIndex]);

    const selectValue = (nextValue: string): void => {
      if (disabled) return;
      setSelected(nextValue);
      setOpen(false);
      const element = selectRef.current;
      if (element) {
        element.value = nextValue;
        element.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    const openAndFocus = (): void => {
      const trigger = triggerRef.current;
      if (trigger) {
        const rect = trigger.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom - 8;
        const spaceAbove = rect.top - 8;
        const flipUp = spaceBelow < POPUP_EST_HEIGHT && spaceAbove > spaceBelow;
        const maxHeight = flipUp
          ? Math.max(POPUP_MIN_HEIGHT, Math.min(POPUP_EST_HEIGHT, spaceAbove))
          : Math.max(POPUP_MIN_HEIGHT, Math.min(POPUP_EST_HEIGHT, spaceBelow));
        const top = flipUp ? Math.max(8, rect.top - maxHeight - 4) : rect.bottom + 4;
        const minWidth = Math.min(
          Math.max(rect.width, POPUP_MIN_WIDTH),
          viewportWidth - 8
        );
        const left = Math.max(
          8,
          Math.min(rect.left, viewportWidth - minWidth - 8)
        );
        setCoords({
          top,
          left,
          minWidth,
          maxWidth: Math.max(minWidth, viewportWidth - left - 8),
          maxHeight,
        });
      }
      setOpen(true);
      const currentIndex = items.findIndex((item) => item.value === selected);
      if (currentIndex !== -1) {
        setFocusedIndex(currentIndex);
      } else {
        const firstEnabled = items.findIndex((item) => !item.disabled);
        setFocusedIndex(firstEnabled === -1 ? 0 : firstEnabled);
      }
    };

    const toggleOpen = (): void => {
      if (open) setOpen(false);
      else openAndFocus();
    };

    const handleButtonKeyDown = (
      event: KeyboardEvent<HTMLButtonElement>
    ): void => {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown" ||
        event.key === "ArrowUp"
      ) {
        event.preventDefault();
        openAndFocus();
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handleItemKeyDown = (
      event: KeyboardEvent<HTMLButtonElement>,
      index: number
    ): void => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        const next = items.findIndex((item, i) => i > index && !item.disabled);
        if (next !== -1) setFocusedIndex(next);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        let previous = -1;
        for (let i = index - 1; i >= 0; i -= 1) {
          if (!items[i].disabled) {
            previous = i;
            break;
          }
        }
        if (previous !== -1) {
          setFocusedIndex(previous);
        } else {
          for (let i = items.length - 1; i > index; i -= 1) {
            if (!items[i].disabled) {
              setFocusedIndex(i);
              break;
            }
          }
        }
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectValue(items[index].value);
      } else if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleItemClick = (
      event: ReactMouseEvent<HTMLButtonElement>,
      index: number
    ): void => {
      event.preventDefault();
      event.stopPropagation();
      selectValue(items[index].value);
    };

    const triggerLabel = current ? current.label : items[0]?.label ?? "";

    return (
      <div ref={rootRef} className={`relative inline-flex w-full ${className}`}>
        {/* Hidden native select keeps form/validation + react-hook-form working */}
        <select
          ref={setSelectRef}
          name={name}
          disabled={disabled}
          defaultValue={value === undefined ? defaultValue : undefined}
          value={value === undefined ? undefined : selected}
          onChange={onChange}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          {...rest}
        />

        <button
          ref={triggerRef}
          type="button"
          id={id ?? generatedId}
          disabled={disabled}
          onClick={toggleOpen}
          onKeyDown={handleButtonKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={ariaLabel}
          className={`flex w-full cursor-pointer items-center justify-between gap-2 border border-brand-200 bg-brand-50/60 font-semibold text-brand-700 outline-none transition-colors hover:border-brand-300 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60 ${SIZE_CLASSES[variant]} ${selectClassName}`}
        >
          <span className="truncate text-left">{triggerLabel}</span>
          <FaChevronDown
            size={variant === "sm" ? 11 : 13}
            className={`shrink-0 text-brand transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open &&
          coords &&
          createPortal(
            <ul
              ref={popupRef}
              role="listbox"
              style={{
                top: coords.top,
                left: coords.left,
                minWidth: coords.minWidth,
                maxWidth: coords.maxWidth,
                maxHeight: coords.maxHeight,
              }}
              className="fixed z-[100] w-max overflow-auto rounded-xl bg-white p-1 shadow-xl ring-1 ring-gray-100 animate-fade-in"
            >
              {items.map((item, index) => (
                <li key={`${item.value}-${index}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={item.value === selected}
                    disabled={item.disabled}
                    onClick={(event) => handleItemClick(event, index)}
                    onKeyDown={(event) => handleItemKeyDown(event, index)}
                    className={`flex w-full items-center whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                      item.value === selected
                        ? "bg-brand-50 text-brand"
                        : item.disabled
                          ? "cursor-not-allowed text-gray-300"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>,
            document.body
          )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
