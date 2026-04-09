import React, { useState, useEffect, Suspense } from "react";
import * as Icons from "lucide-react";
import { formatPhone442, formatPhone433 } from "./utils/formatPhone.js";
import YoutubeEmbed from "./utils/YoutubeEmbed.jsx";
import { MechanismSection } from "./components/MechanismSection.tsx";
import { FeedbackVideoCarousel } from "./components/FeedbackVideoCarousel.tsx";
import { BeforeAfterComparison } from "./components/BeforeAfterComparison.tsx";
import { CesWhySection } from "./components/CesWhySection.tsx";
const NODE_ENV = import.meta.env.VITE_NODE_ENV
const iconMap = {
  Phone: Icons["Phone"],
  MessageCircle: Icons["MessageCircle"],
  ChevronDown: Icons["ChevronDown"],
  ChevronUp: Icons["ChevronUp"],
  CheckCircle2: Icons["CheckCircle2"],
  ArrowRight: Icons["ArrowRight"],
  ShieldCheck: Icons["ShieldCheck"],
  Award: Icons["Award"],
  Users: Icons["Users"],
  Smile: Icons["Smile"],
  Languages: Icons["Languages"],
};
import {
  LOGO_URL,
  LIFESTYLE_IMAGES,
  NAVIGATION,

  // COLORS
} from "./constants";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
// --- Sub-components ---

// function ChangeLanguageIcon() {
//   const { i18n } = useTranslation();

//   const handleChangeLanguage = () => {
//     const nextLang = i18n.language === "vi" ? "en" : "vi";
//     i18n.changeLanguage(nextLang);
//   };

//   return (
//     <button
//       onClick={handleChangeLanguage}
//       className="flex items-center gap-1 cursor-pointer p-2"
//     >
//       <iconMap.Languages size={20} />
//       <span className="text-sm font-semibold w-6 text-center">
//         {i18n.language.toUpperCase()}
//       </span>
//     </button>
//   );
// }
//
const renderHighlight = (text="") => {
  const parts = text.split(/(\[\[.*?\]\])/g);

  return parts.map((part, index) => {
    if (part.startsWith("[[") && part.endsWith("]]")) {
      const cleanText = part.slice(2, -2);
      return (
        <span key={index} className="text-green-600">
          {cleanText}
        </span>
      );
    }
    return part;
  });
};
let ASSETS_URL =null;
if(NODE_ENV==='development'){
  ASSETS_URL = "http://localhost:8081/"; 
}else{
  ASSETS_URL="/";
}

const Navbar: React.FC<any> = ({ data }) => {
  const { t } = useTranslation();
  // start

  //end
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <img src={LOGO_URL} alt="ToppiLife Logo" className="h-10 md:h-14" />
        </a>

        <div className="hidden md:flex items-center space-x-8">
          {NAVIGATION.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              {t(item.name)}
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <a
            href={"tel:" + data?.customize?.phone}
            className="items-center text-green-700 font-bold hidden md:flex "
          >
            <iconMap.Phone className="w-5 h-5 mr-2" />
            {formatPhone433(data?.customize?.phone)}
          </a>
          <a href={"tel:" + data?.customize?.phone}>
            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95  block">
              Nhận tư vấn ngay
            </button>
          </a>

          {/* <div className="flex items-center gap-4">
            <ChangeLanguageIcon />
          </div> */}
        </div>
      </div>
    </nav>
  );
};

const Hero: React.FC<any> = ({ data }) => (
  <section
    id="intro"
    className="relative min-h-screen flex items-center pt-20 overflow-hidden"
  >
    <div className="absolute inset-0 z-0">
      <img
        src={data?.hero?.url_img || null}
        alt="Nature Relax"
        className="w-full h-full object-cover opacity-10"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-white to-blue-50/50"></div>
    </div>

    <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-8 text-center md:text-left">
        <div className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
          {data?.hero?.badge}
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          {renderHighlight(data?.hero?.title)}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto md:mx-0">
          {data?.hero?.desc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <a
            href={"https://zalo.me/" + data?.customize?.zalo}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl transition-all hover:-translate-y-1"
          >
            Tìm hiểu ngay <iconMap.ArrowRight className="ml-2 w-5 h-5" />
          </a>
          <div className="flex items-center justify-center space-x-2 text-gray-500 font-medium">
            <iconMap.CheckCircle2 className="text-green-500" />
            <span>Công nghệ CES Mỹ</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 bg-green-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <img
          src={ASSETS_URL + (data?.hero?.img_url ?? null)}
          alt="ToppiLife CES Device"
          className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl rounded-2xl transform hover:rotate-2 transition-transform duration-500"
        />
        <div className="absolute z-9 -bottom-2 -left-3 md:bottom-12 md:-left-12 bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <iconMap.Smile className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800">
              {data?.hero?.badge_right.number}
            </div>
            <div className="text-xs text-gray-500">
              {data?.hero?.badge_right.desc}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PainPoints: React.FC<any> = ({ data }) => (
  <section className="py-24 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {data?.issue?.title}
        </h2>
        <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="grid grid-cols-1 gap-4">
          {data?.issue.issues.map((point, i) => (
            <div
              key={i}
              className="flex items-start bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors group"
            >
              <div className="bg-red-50 text-red-500 p-2 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                <iconMap.ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-lg text-gray-700 font-medium">{point}</p>
            </div>
          ))}
        </div>
        <div className="bg-green-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold">
              {data?.issue?.card?.title}
            </h3>
            <p className="text-lg text-green-50 leading-relaxed">
              {data?.issue?.card?.desc}
            </p>
            <div className="pt-4 aspect-2.5/1 overflow-hidden">
              <img
                src={ASSETS_URL + (data?.issue?.card?.img_url || "")}
                alt="Stress"
                className="rounded-2xl shadow-lg opacity-90 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Technology: React.FC<any> = ({ data }) => (
  <section id="benefits" className="py-24 overflow-hidden">
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <img
            src={ASSETS_URL + (data?.solution?.img_url || "")}
            alt="CES Technology"
            className="relative z-10 rounded-3xl shadow-2xl"
          />
        </div>
        <div className="lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
              {data?.solution?.title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {data?.solution?.desc}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {data?.solution?.cards.map((val, i) => {
              let Icon = Icons[val?.icon as keyof typeof Icons];
              return (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow-md border border-gray-50 hover:shadow-xl transition-all"
                >
                  <div className="text-green-600 mb-4">
                    {Icon && <Icon size={28} />}
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg mb-2">
                    {val.title}
                  </h4>
                  <p className="text-gray-500 text-sm">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Features: React.FC<any> = ({ data }) => (
  <section id="product" className="py-24 bg-green-50">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          {data?.benefit?.title}
        </h2>
        <p className="text-lg text-gray-600">{data?.benefit?.desc}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data?.benefit?.cards.map((feat, i) => {
          let Icon = Icons[feat?.icon as keyof typeof Icons];
          return (
            <div
              key={i}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={ASSETS_URL + feat.img_url}
                  alt={feat.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                  {Icon && <Icon size={28} />}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {feat.title}
                </h4>
                <p className="text-gray-600 text-sm">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 bg-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/3">
          <img
            src={ASSETS_URL + (data?.benefit?.footer_card?.img_url || "")}
            alt="CES Device"
            className="w-full max-w-xs mx-auto transform -rotate-6"
          />
        </div>
        <div className="md:w-2/3 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {data?.benefit?.footer_card?.lable}
          </h3>
          <ul className="space-y-4">
            {/* // [
            //   "Dễ đi vào giấc ngủ hơn tự nhiên",
            //   "Ngủ sâu và trọn vẹn hơn từng đêm",
            //   "Thức dậy with cảm giác nhẹ đầu, tỉnh táo",
            //   "Giải pháp không dùng thuốc, an toàn tuyệt đối"
            // ] */}
            {data?.benefit?.footer_card?.solution.map((text, idx) => (
              <li
                key={idx}
                className="flex items-center space-x-3 text-lg font-medium text-gray-700"
              >
                <div className="bg-green-100 p-1 rounded-full">
                  <iconMap.CheckCircle2 className="text-green-600 w-5 h-5" />
                </div>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const TargetAudience: React.FC<any> = ({ data }) => (
  <section className="py-24">
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="lg:w-1/2 space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {data?.target_user?.title}
          </h2>
          <div className="space-y-4">
            {// [
            //   "Người thường xuyên căng thẳng, áp lực công việc kéo dài.",
            //   "Người khó ngủ, ngủ không sâu, hay tỉnh giấc giữa đêm.",
            //   "Người làm việc trí óc, cần sự tỉnh táo và cân bằng tinh thần.",
            //   "Người gặp áp lực tâm lý, lo âu và trầm cảm.",
            //   "Người muốn giải pháp thư giãn không dùng thuốc tại nhà."
            // ]
            data?.target_user?.list.map((text, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-green-200 transition-all"
              >
                <iconMap.Users className="text-green-600 flex-shrink-0" />
                <p className="font-medium text-gray-700">{text}</p>
              </div>
            ))}
          </div>
          <div className="p-4 bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400 text-sm">
            {data?.target_user?.note}
          </div>
          <button className="w-full sm:w-auto bg-green-600 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-green-700 transition-all flex items-center justify-center">
            Kiểm tra mức độ phù hợp ngay <iconMap.ArrowRight className="ml-2" />
          </button>
        </div>
        <div className="lg:w-1/2">
          <img
            src={ASSETS_URL + (data?.target_user?.img_url || "")}
            alt="Professional Working"
            className="rounded-3xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  </section>
);

const Usage: React.FC<any> = ({ data }) => {
  // console.log(data?.how_to_use?.video_url);
  return (
    <section className="py-24 bg-gray-900 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            {data?.how_to_use?.title}
          </h2>
          <p className="text-green-400 font-medium uppercase tracking-widest text-sm">
            {data?.how_to_use?.desc}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data?.how_to_use?.cards.map((step, i) => (
            <div key={i} className="relative group">
              <div className="absolute top-0 left-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center font-bold text-xl z-10 -ml-4 -mt-4 shadow-lg">
                {i + 1}
              </div>
              <div className="bg-gray-800 rounded-3xl overflow-hidden h-full flex flex-col border border-gray-700 group-hover:border-green-500 transition-all">
                <img
                  src={ASSETS_URL + step.img_url}
                  alt={step.title}
                  className="h-40 w-full object-cover grayscale group-hover:grayscale-0 transition-all"
                />
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-green-400">
              {data?.how_to_use?.guide_title}
            </h3>
            <div className="space-y-4">
              {// [
              //   { t: "Phút 1-5", d: "Đeo kẹp tai, chọn mức cường độ từ 0-35 phù hợp cảm nhận." },
              //   { t: "Phút 6-10", d: "Cơ thể bắt đầu thả lỏng, kết hợp đọc sách hoặc nhắm mắt." },
              //   { t: "Phút 11-15", d: "Máy tự động kết thúc, trả lại cho bạn tâm trí nhẹ nhàng." }
              // ]
              data?.how_to_use?.guide.map((item, idx) => (
                <div
                  key={idx}
                  className="flex space-x-4 border-l-2 border-green-500/30 pl-6 py-2 hover:bg-white/5 transition-colors rounded-r-xl"
                >
                  <div>
                    <div className="text-green-500 font-bold">
                      {item.minute}
                    </div>
                    <div className="text-gray-300">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-green-500/10 p-4 rounded-2xl border border-green-500/20 text-green-300 font-medium">
              Tần suất lý tưởng: Chỉ cần 1-2 lần mỗi ngày để cảm nhận thay đổi
              rõ rệt.
            </div>
          </div>

          {/* <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-800 flex items-center justify-center shadow-2xl group cursor-pointer"> */}
          {/* <img
            src={LIFESTYLE_IMAGES.RELAX}
            alt="Video Thumbnail"
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform"
          />
          <div className="relative z-10 w-20 h-20 bg-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
          </div>
          <div className="absolute bottom-4 left-4 font-bold text-lg">
            VIDEO HƯỚNG DẪN
          </div> */}

          <YoutubeEmbed videoId={data?.how_to_use?.video_url} />
          {/* </div> */}
        </div>
      </div>
    </section>
  );
};

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left hover:text-green-600 transition-colors group"
      >
        <span className="text-lg font-bold text-gray-800 pr-4">{q}</span>
        {isOpen ? (
          <iconMap.ChevronUp className="text-green-600" />
        ) : (
          <iconMap.ChevronDown className="text-gray-400 group-hover:text-green-600" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-6" : "max-h-0"}`}
      >
        <p className="text-gray-600 leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

const FAQ: React.FC<any> = ({ data }) => (
  <section id="faq" className="py-24">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">{data?.faq?.title}</h2>
        <p className="text-gray-500">{data?.faq?.desc}</p>
      </div>
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
        {// FAQS
        data?.faq?.list.map((faq, i) => (
          <FAQItem key={i} q={faq.question} a={faq.anwser} />
        ))}
      </div>
    </div>
  </section>
);

const Commitment: React.FC<any> = ({ data }) => (
  <section className="py-20 bg-green-900 text-white">
    <div className="container mx-auto px-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {// [
        //   { icon: <Award />, title: "Thiết bị đạt chuẩn", desc: "Được nghiên cứu và ứng dụng thực tế" },
        //   { icon: <ShieldCheck />, title: "Bảo hành uy tín", desc: "Hỗ trợ 1 đổi 1 trong vòng 12 tháng" },
        //   { icon: <Users />, title: "Tư vấn chuyên nghiệp", desc: "Đồng hành suốt quá trình sử dụng" },
        //   { icon: <MessageCircle />, title: "Hỗ trợ 24/7", desc: "Đội ngũ chuyên gia luôn sẵn sàng" }
        // ]
        data?.testimonials.map((item, i) => {
          let Icon = Icons[item?.icon as keyof typeof Icons];

          return (
            <div key={i} className="text-center space-y-4 group">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-green-400 group-hover:bg-green-500 group-hover:text-white transition-all">
                {Icon && <Icon size={28} />}
              </div>
              <h4 className="font-bold text-xl">{item.title}</h4>
              <p className="text-green-200/70 text-sm">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const Footer: React.FC<any> = ({ data }) => (
  <footer className="bg-gray-50 pt-24 pb-12 border-t border-gray-100">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 lg:col-span-2 space-y-6 text-center md:text-left">
          <img
            src={LOGO_URL}
            alt="ToppiLife Logo"
            className="h-16 mx-auto md:mx-0"
          />
          <p className="text-gray-500 max-w-md">{data?.customize?.worktime}</p>
          <div className="flex justify-center md:justify-start space-x-4">
            <a target="_blank" href={data?.customize?.facebook}>
              <button className="p-3 bg-white shadow-md rounded-full text-blue-600 hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </a>
            <a target="_blank" href={data?.customize?.youtube}>
              <button className="p-3 bg-white shadow-md rounded-full text-red-600 hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </button>
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold text-gray-900 uppercase tracking-wider">
            Thông tin liên hệ
          </h4>
          <ul className="space-y-4 text-gray-600">
            <li className="font-bold text-gray-900">
              Công ty Cổ phần ToppiGroup
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-green-500">
                <Icons.MapPinHouse />
              </span>
              {data?.customize?.address}
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-green-500">
                <Icons.Phone />
              </span>
              {formatPhone433(data?.customize?.phone)}
            </li>
            <li className="">
              <a
                href={"mailto:" + data?.customize?.email}
                className="flex items-center"
              >
                <span className="mr-3 text-green-500">
                  <Icons.Mail />
                </span>
                {data?.customize?.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold text-gray-900 uppercase tracking-wider">
            Chứng nhận
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center">
              <span className="font-bold text-gray-600">CFDA</span>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center">
              <span className="font-bold text-gray-600">CE</span>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center">
              <span className="font-bold text-gray-600">ROHS</span>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center">
              <span className="font-bold text-gray-600">ISO9001</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>© 2024 ToppiLife. Tất cả quyền được bảo lưu.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-green-600 transition-colors">
            Chính sách bảo mật
          </a>
          <a href="#" className="hover:text-green-600 transition-colors">
            Điều khoản sử dụng
          </a>
        </div>
      </div>
    </div>
  </footer>
);

const FloatButtons: React.FC<any> = ({ data }) => (
  <div className="fixed bottom-8 right-8 z-[100] flex flex-col space-y-4">
    <a
      href={"https://zalo.me/" + data?.customize?.zalo}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
        alt="Zalo"
        className="w-8 h-8"
      />
    </a>
    <a
      href={"tel:" + data?.customize?.phone}
      className="bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all relative group"
    >
      <iconMap.Phone className="w-6 h-6" />
      <span className="absolute right-16 bg-white text-green-700 font-bold px-4 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Gọi ngay: {formatPhone433(data?.customize?.phone)}
      </span>
    </a>
  </div>
);

const FinalCTA: React.FC<any> = ({ data }) => (
  <section className="py-24 relative overflow-hidden bg-green-600">
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      {/* <img
        src={LIFESTYLE_IMAGES.SLEEP}
        alt="Sleeping"
        className="w-full h-full object-cover"
      /> */}
    </div>
    <div className="container mx-auto px-4 relative z-10 text-center text-white space-y-8 max-w-4xl">
      <h2 className="text-3xl md:text-5xl font-bold leading-tight">
        {data?.contact?.title}
      </h2>
      <p className="text-xl text-green-50">{data?.contact?.desc}</p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
        <a href={"tel:" + data?.customize?.phone}>
          <button className="bg-white text-green-700 hover:bg-green-50 px-12 py-5 rounded-full text-xl font-bold shadow-2xl transition-all hover:scale-105">
            Nhận tư vấn miễn phí
          </button>
        </a>
        <a
          target="_blank"
          href={"https://zalo.me/" + data?.customize?.zalo}
          className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-12 py-5 rounded-full text-xl font-bold transition-all"
        >
          Chat qua Zalo
        </a>
      </div>
    </div>
  </section>
);

// --- Main App ---
const App: React.FC = () => {
  const [pageData, setPageData] = useState(null);
  //

  let apiLanding =null;
  if(NODE_ENV==='development'){
    apiLanding="http://localhost:8081/api/landing"
  }else{
    apiLanding="/api/landing"
  }
  useEffect(() => {
    fetch(apiLanding)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.data);
        setPageData(data.data);
      });
  }, []);
  if (!pageData){
    return (
      <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
    </div>
    )}
  return (
    <>
      <Helmet>
        {/* Title */}
        <title>{pageData?.customize?.title}</title>

        {/* Basic SEO */}
        <meta name="description" content={pageData?.customize?.desc} />

        <meta name="keywords" content={pageData?.customize?.keywords} />

        <meta name="robots" content="index, follow" />

        {/* Open Graph (Facebook, Zalo) */}
        <meta property="og:title" content={pageData?.customize?.title} />
        <meta
          property="og:description"
          content={pageData?.customize?.keywords}
        />
        <meta
          property="og:image"
          content={pageData?.customize?.canonical + pageData?.customize?.img}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageData?.customize?.canonical} />
        <meta property="og:site_name" content="CES Toppilife" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageData?.customize?.title} />
        <meta name="twitter:description" content={pageData?.customize?.desc} />
        <meta
          name="twitter:image"
          content={pageData?.customize?.canonical + pageData?.customize?.img}
        />

        {/* Mobile */}
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}

        {/* Canonical */}
        <link rel="canonical" href={pageData?.customize?.canonical || ""} />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Navbar data={pageData} />
        <Hero data={pageData} />
        <PainPoints data={pageData} />
        <MechanismSection data={pageData} />
        <Technology data={pageData} />
        <Features data={pageData} />
        <FeedbackVideoCarousel data={pageData} />
        <BeforeAfterComparison data={pageData} />
        <TargetAudience data={pageData} />
        <CesWhySection data={pageData} />
        <Usage data={pageData} />
        <Commitment data={pageData} />
        <FAQ data={pageData} />
        <FinalCTA data={pageData} />
        <Footer data={pageData} />
        <FloatButtons data={pageData} />
      </div>
    </>
  );
};

export default App;
