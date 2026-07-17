export const isPreviewWithinRenderWindow = (index, activeIndex, itemCount, radius = 2) => {
  if (itemCount <= radius * 2 + 1) return true;

  const directDistance = Math.abs(index - activeIndex);
  const wrappedDistance = itemCount - directDistance;
  return Math.min(directDistance, wrappedDistance) <= radius;
};
