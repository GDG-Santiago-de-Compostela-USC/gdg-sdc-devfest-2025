# React Bits Magnet

`Magnet.tsx` is adapted from [React Bits Magnet](https://reactbits.dev/animations/magnet), by David Haz.

Source: https://github.com/DavidHDev/react-bits/tree/main/src/ts-default/Animations/Magnet

The upstream license is preserved in `LICENSE.md`. The component is used as part of this event website.

Local adaptations respect changes to the reduced motion preference at runtime, reset motion immediately when requested, and limit `will-change` to active interaction. The hero limits displacement to 18 pixels and ignores touch pointers.
