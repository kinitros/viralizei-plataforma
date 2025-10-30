import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import InstagramServices from "@/pages/InstagramServices";
import TiktokServices from "@/pages/TiktokServices";
import YouTubeServices from "@/pages/YouTubeServices";
import FacebookServices from "@/pages/FacebookServices";
import XServices from "@/pages/XServices";
import KwaiServices from "@/pages/KwaiServices";
import InstagramFollowersWorldwide from "@/pages/InstagramFollowersWorldwide";
import InstagramFollowersBrazil from "@/pages/InstagramFollowersBrazil";
import InstagramLikesWorldwide from '@/pages/InstagramLikesWorldwide';
import InstagramLikesBrazil from '@/pages/InstagramLikesBrazil';
import InstagramViewsReels from '@/pages/InstagramViewsReels';
import InstagramViewsStories from '@/pages/InstagramViewsStories';
import TiktokFollowersWorldwide from '@/pages/TiktokFollowersWorldwide';
import TiktokFollowersBrazil from '@/pages/TiktokFollowersBrazil';
import TiktokLikesWorldwide from '@/pages/TiktokLikesWorldwide';
import TiktokLikesBrazil from '@/pages/TiktokLikesBrazil';
import TiktokViews from '@/pages/TiktokViews';
import YouTubeSubscribers from '@/pages/YouTubeSubscribers';
import YouTubeLikes from '@/pages/YouTubeLikes';
import YouTubeViews from '@/pages/YouTubeViews';
import FacebookFollowersWorldwide from '@/pages/FacebookFollowersWorldwide';
import FacebookLikes from '@/pages/FacebookLikes';
import FacebookViews from '@/pages/FacebookViews';
import TwitterFollowers from '@/pages/TwitterFollowers';
import TwitterLikes from '@/pages/TwitterLikes';
import TwitterViews from '@/pages/TwitterViews';
import KwaiFollowersBrazil from '@/pages/KwaiFollowersBrazil';
import KwaiLikes from '@/pages/KwaiLikes';
import KwaiViews from '@/pages/KwaiViews';
import AdminCheckout from '@/pages/AdminCheckout';
import AdminRedirectLinks from '@/pages/AdminRedirectLinks';
import AdminLogin from '@/pages/AdminLogin';
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-32">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todos-os-servicos" element={<div className="text-center text-xl py-20">Todos os Serviços - Em Breve</div>} />
            <Route path="/descontos" element={<div className="text-center text-xl py-20">Descontos - Em Breve</div>} />
            <Route path="/perguntas" element={<div className="text-center text-xl py-20">FAQ - Em Breve</div>} />
            <Route path="/ferramentas" element={<div className="text-center text-xl py-20">Ferramentas - Em Breve</div>} />
            <Route path="/carreiras" element={<div className="text-center text-xl py-20">Carreiras - Em Breve</div>} />
            <Route path="/instagram" element={<InstagramServices />} />
            <Route path="/instagram/seguidores-mundiais" element={<InstagramFollowersWorldwide />} />
            <Route path="/instagram/seguidores-brasileiros" element={<InstagramFollowersBrazil />} />
            <Route path="/instagram/curtidas-mundiais" element={<InstagramLikesWorldwide />} />
            <Route path="/instagram/curtidas-brasileiras" element={<InstagramLikesBrazil />} />
            <Route path="/instagram/visualizacoes-reels" element={<InstagramViewsReels />} />
            <Route path="/instagram/visualizacoes-stories" element={<InstagramViewsStories />} />
            <Route path="/tiktok" element={<TiktokServices />} />
            <Route path="/tiktok/seguidores-mundiais" element={<TiktokFollowersWorldwide />} />
            <Route path="/tiktok/seguidores-brasileiros" element={<TiktokFollowersBrazil />} />
            <Route path="/tiktok/curtidas-mundiais" element={<TiktokLikesWorldwide />} />
            <Route path="/tiktok/curtidas-brasileiras" element={<TiktokLikesBrazil />} />
            <Route path="/tiktok/visualizacoes" element={<TiktokViews />} />
            <Route path="/youtube" element={<YouTubeServices />} />
            <Route path="/youtube/inscritos" element={<YouTubeSubscribers />} />
            <Route path="/youtube/curtidas" element={<YouTubeLikes />} />
            <Route path="/youtube/visualizacoes" element={<YouTubeViews />} />
            <Route path="/facebook" element={<FacebookServices />} />
            <Route path="/facebook/seguidores-mundiais" element={<FacebookFollowersWorldwide />} />
            <Route path="/facebook/curtidas" element={<FacebookLikes />} />
            <Route path="/facebook/visualizacoes" element={<FacebookViews />} />
            <Route path="/twitter" element={<XServices />} />
            <Route path="/twitter/seguidores" element={<TwitterFollowers />} />
            <Route path="/twitter/curtidas" element={<TwitterLikes />} />
            <Route path="/twitter/visualizacoes" element={<TwitterViews />} />
            <Route path="/kwai" element={<KwaiServices />} />
            <Route path="/kwai/seguidores-brasileiros" element={<KwaiFollowersBrazil />} />
            <Route path="/kwai/curtidas-brasileiras" element={<KwaiLikes />} />
            <Route path="/kwai/visualizacoes" element={<KwaiViews />} />
            <Route path="/admin/checkout" element={<AdminCheckout />} />
            <Route path="/admin/redirect-links" element={<AdminRedirectLinks />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppFloatingButton />
      </div>
    </Router>
  );
}
