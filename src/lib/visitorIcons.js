import {
  Plane, Train, Bus, Car, Smartphone, Bike, MapPin,
  HeartPulse, Activity, Shield, Flame, PhoneCall, LifeBuoy,
  Banknote, Landmark, Wifi, Mail, Sparkles, HeartHandshake,
  Dumbbell, Trophy, Droplet, Info, BookOpen, UserCheck,
  Briefcase, ShoppingBag, ChevronRight
} from "lucide-react";

export function getVisitorItemIcon(label) {
  if (!label) return ChevronRight;
  const text = label.toLowerCase();
  
  if (text.includes("airport") || text.includes("bandara")) return Plane;
  if (text.includes("train") || text.includes("kereta")) return Train;
  if (text.includes("bus") || text.includes("trans")) return Bus;
  if (text.includes("taxi") || text.includes("taksi") || text.includes("car") || text.includes("mobil") || text.includes("transport")) return Car;
  if (text.includes("online")) return Smartphone;
  if (text.includes("motor") || text.includes("sepeda") || text.includes("bicycle")) return Bike;
  if (text.includes("parking") || text.includes("parkir")) return MapPin;
  if (text.includes("hospital") || text.includes("rumah sakit") || text.includes("clinic") || text.includes("klinik")) return HeartPulse;
  if (text.includes("pharmac") || text.includes("apotek")) return Activity;
  if (text.includes("police") || text.includes("polisi")) return Shield;
  if (text.includes("fire") || text.includes("pemadam")) return Flame;
  if (text.includes("emergency") || text.includes("darurat")) return PhoneCall;
  if (text.includes("assist") || text.includes("bantuan")) return LifeBuoy;
  if (text.includes("money") || text.includes("uang")) return Banknote;
  if (text.includes("bank") || text.includes("atm")) return Landmark;
  if (text.includes("sim")) return Smartphone;
  if (text.includes("internet") || text.includes("wi-fi") || text.includes("wifi")) return Wifi;
  if (text.includes("post") || text.includes("pos")) return Mail;
  if (text.includes("spa") || text.includes("wellness")) return Sparkles;
  if (text.includes("massage") || text.includes("pijat")) return HeartHandshake;
  if (text.includes("gym") || text.includes("kebugaran")) return Dumbbell;
  if (text.includes("sport") || text.includes("olahraga")) return Trophy;
  if (text.includes("pool") || text.includes("renang") || text.includes("toilet")) return Droplet;
  if (text.includes("information") || text.includes("informasi")) return Info;
  if (text.includes("prayer") || text.includes("ibadah")) return BookOpen;
  if (text.includes("access") || text.includes("akses")) return UserCheck;
  if (text.includes("luggage") || text.includes("barang")) return Briefcase;
  if (text.includes("laundr") || text.includes("binatu")) return ShoppingBag;

  return ChevronRight;
}
