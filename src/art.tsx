export default function HeroArt({ alt }: { alt: string }) {
  return (
    <img src="https://images.pexels.com/photos/28456460/pexels-photo-28456460/free-photo-of-modern-minimalist-home-interior-design.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt={alt} loading="lazy" className="h-auto w-full object-cover" />
  )
}
