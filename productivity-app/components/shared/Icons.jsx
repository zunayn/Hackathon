// File: src/components/shared/Icons.jsx
import React from 'react';
import { Svg, Path, Circle, Line, Rect, Polyline } from 'react-native-svg';

// Note: For these icons to work, you must have react-native-svg installed.
// Run: npx expo install react-native-svg

export const UserIcon = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

export const UsersIcon = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

export const GitBranchIcon = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Line x1="6" y1="3" x2="6" y2="15" />
    <Circle cx="18" cy="6" r="3" />
    <Circle cx="6" cy="18" r="3" />
    <Path d="M18 9a9 9 0 0 1-9 9" />
  </Svg>
);

export const CalendarIcon = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

export const MessageSquareIcon = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

export const CheckCircleIcon = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Polyline points="22 4 12 14.01 9 11.01" />
  </Svg>
);

export const BrainCircuitIcon = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M12 5a3 3 0 1 0-5.993.142" />
    <Path d="M18 8a4 4 0 0 0-7.233-2.12" />
    <Path d="M5 14a3 3 0 1 0-2.336 2.82" />
    <Path d="M19.5 13a3.5 3.5 0 0 0-5.485-2.525" />
    <Path d="M12 18a3 3 0 1 0-3.376 3.877" />
    <Path d="M18 20a4 4 0 0 0 .336-6.933" />
    <Path d="M5 14a3 3 0 1 0-2.336 2.82" />
    <Path d="M12 5a3 3 0 1 0-5.993.142" />
    <Path d="m11 8 2 3" />
    <Path d="m14 13 2 2" />
    <Path d="m6 15 1 1" />
  </Svg>
);

export const PlusCircleIcon = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="8" x2="12" y2="16" />
    <Line x1="8" y1="12" x2="16" y2="12" />
  </Svg>
);

export const Trash2Icon = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <Line x1="10" y1="11" x2="10" y2="17" />
    <Line x1="14" y1="11" x2="14" y2="17" />
  </Svg>
);

export const EditIcon = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Svg>
);

export const XIcon = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

export const RefreshCwIcon = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <Path d="M21 3v5h-5" />
    <Path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <Path d="M3 21v-5h5" />
  </Svg>
);

export const FocusIcon = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Circle cx="12" cy="12" r="3" />
    <Path d="M3 12h3m13 0h-3M12 3v3m0 13v-3" />
  </Svg>
);

export const AlertTriangleIcon = (props) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></Path>
        <Line x1="12" y1="9" x2="12" y2="13"></Line>
        <Line x1="12" y1="17" x2="12.01" y2="17"></Line>
    </Svg>
);

export const CheckIcon = (props) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <Polyline points="20 6 9 17 4 12"></Polyline>
    </Svg>
);

