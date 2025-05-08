import { ComponentTypes } from 'oceanic.js';
import type { CSSProperties } from 'react';
import { baseImageStyle, containerStyle } from './styles';

/**
 * Gets the appropriate label for different select menu types
 */
export const getSelectTypeLabel = (type: ComponentTypes): string => {
  switch (type) {
    case ComponentTypes.USER_SELECT:
      return 'Select User';
    case ComponentTypes.ROLE_SELECT:
      return 'Select Role';
    case ComponentTypes.MENTIONABLE_SELECT:
      return 'Select Mentionable';
    case ComponentTypes.CHANNEL_SELECT:
      return 'Select Channel';
    case ComponentTypes.STRING_SELECT:
      return 'Make a Selection';
    default:
      return 'Select Option';
  }
};

/**
 * Gets the grid layout for media galleries based on count
 */
export const getGalleryLayout = (count: number): CSSProperties => {
  if (count === 1) {
    return {
      ...containerStyle,
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto',
    };
  } else if (count === 2) {
    return {
      ...containerStyle,
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: 'auto',
    };
  } else if (count === 3 || count === 4) {
    return {
      ...containerStyle,
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
    };
  } else if (count === 5) {
    return {
      ...containerStyle,
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: 'auto auto',
    };
  } else if (count >= 7) {
    return {
      ...containerStyle,
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: 'auto auto auto auto',
    };
  } else {
    return {
      ...containerStyle,
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: 'auto',
    };
  }
};

/**
 * Gets the style for an individual image based on its position and total count
 */
export const getImageStyle = (idx: number, count: number): CSSProperties => {
  if (count === 3 && idx === 0) {
    return {
      ...baseImageStyle,
      gridRow: '1 / span 2',
      gridColumn: '1',
      aspectRatio: '1/2',
    };
  }

  if (count === 5) {
    if (idx < 2) {
      return {
        ...baseImageStyle,
        gridRow: '1',
        gridColumn: idx === 0 ? '1 / span 2' : '3',
      };
    } else {
      return {
        ...baseImageStyle,
        gridRow: '2',
        gridColumn: `${idx - 2 + 1}`,
      };
    }
  }

  if (count === 7) {
    if (idx === 0) {
      return {
        ...baseImageStyle,
        gridRow: '1',
        gridColumn: '1 / span 3',
      };
    } else if (idx <= 3) {
      return {
        ...baseImageStyle,
        gridRow: '2',
        gridColumn: `${idx - 0}`,
      };
    } else {
      return {
        ...baseImageStyle,
        gridRow: '3',
        gridColumn: `${idx - 3}`,
      };
    }
  }

  if (count === 8) {
    if (idx < 2) {
      return {
        ...baseImageStyle,
        gridRow: '1',
        gridColumn: idx === 0 ? '1 / span 2' : '3',
      };
    } else if (idx < 5) {
      return {
        ...baseImageStyle,
        gridRow: '2',
        gridColumn: `${idx - 2 + 1}`,
      };
    } else {
      return {
        ...baseImageStyle,
        gridRow: '3',
        gridColumn: `${idx - 5 + 1}`,
      };
    }
  }

  if (count === 10) {
    if (idx === 0) {
      return {
        ...baseImageStyle,
        gridRow: '1',
        gridColumn: '1 / span 3',
      };
    } else if (idx <= 3) {
      return {
        ...baseImageStyle,
        gridRow: '2',
        gridColumn: `${idx - 0}`,
      };
    } else if (idx <= 6) {
      return {
        ...baseImageStyle,
        gridRow: '3',
        gridColumn: `${idx - 3}`,
      };
    } else {
      return {
        ...baseImageStyle,
        gridRow: '4',
        gridColumn: `${idx - 6}`,
      };
    }
  }

  return baseImageStyle;
};
