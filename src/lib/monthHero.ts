/** Hero art per calendar month (0 = January … 11 = December). Files in /public/months/. */
export const MONTH_HERO_IMAGES: readonly string[] = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1457269449834-928af64c684d?q=80&w=1800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?q=80&w=1800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1800&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=1800&auto=format&fit=crop"
] as const;

export function getHeroImageSrcForMonth(date: Date): string {
  return MONTH_HERO_IMAGES[date.getMonth()] ?? MONTH_HERO_IMAGES[0];
}
