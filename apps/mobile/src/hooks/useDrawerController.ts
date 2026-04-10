import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, PanResponder } from 'react-native';
import { clamp } from '../utils/number';

interface UseDrawerControllerResult {
  drawerTranslateY: Animated.Value;
  drawerCollapsedTranslate: number;
  panHandlers: ReturnType<typeof PanResponder.create>['panHandlers'];
  collapseDrawer: () => void;
  getDrawerTranslate: () => number;
}

export function useDrawerController(
  drawerExpandedHeight: number,
  drawerPeekHeight: number,
): UseDrawerControllerResult {
  const drawerCollapsedTranslate = drawerExpandedHeight - drawerPeekHeight;
  const drawerTranslateY = useRef(new Animated.Value(drawerCollapsedTranslate)).current;
  const drawerTranslateRef = useRef(drawerCollapsedTranslate);
  const dragStartRef = useRef(drawerCollapsedTranslate);

  useEffect(() => {
    const subscription = drawerTranslateY.addListener(({ value }) => {
      drawerTranslateRef.current = value;
    });
    return () => {
      drawerTranslateY.removeListener(subscription);
    };
  }, [drawerTranslateY]);

  const animateDrawer = useCallback((toValue: number) => {
    Animated.spring(drawerTranslateY, {
      toValue,
      useNativeDriver: true,
      damping: 20,
      stiffness: 180,
      mass: 0.5,
    }).start();
  }, [drawerTranslateY]);

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_evt, gestureState) => Math.abs(gestureState.dy) > 4,
    onPanResponderGrant: () => {
      dragStartRef.current = drawerTranslateRef.current;
    },
    onPanResponderMove: (_evt, gestureState) => {
      if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
        return;
      }
      const next = clamp(
        dragStartRef.current + gestureState.dy,
        0,
        drawerCollapsedTranslate,
      );
      drawerTranslateY.setValue(next);
    },
    onPanResponderRelease: (_evt, gestureState) => {
      const current = drawerTranslateRef.current;
      const shouldExpand = gestureState.vy < -0.4 || current < drawerCollapsedTranslate / 2;
      animateDrawer(shouldExpand ? 0 : drawerCollapsedTranslate);
    },
    onPanResponderTerminate: () => {
      const current = drawerTranslateRef.current;
      animateDrawer(current < drawerCollapsedTranslate / 2 ? 0 : drawerCollapsedTranslate);
    },
  }), [animateDrawer, drawerCollapsedTranslate, drawerTranslateY]);

  const collapseDrawer = useCallback(() => {
    animateDrawer(drawerCollapsedTranslate);
  }, [animateDrawer, drawerCollapsedTranslate]);

  const getDrawerTranslate = useCallback(() => drawerTranslateRef.current, []);

  return {
    drawerTranslateY,
    drawerCollapsedTranslate,
    panHandlers: panResponder.panHandlers,
    collapseDrawer,
    getDrawerTranslate,
  };
}
