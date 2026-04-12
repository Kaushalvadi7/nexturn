import React, { useState } from 'react';

const AdminIconPicker = ({ isOpen, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = {
    "Manufacturing & Precision": [
      "settings_suggest", "precision_manufacturing", "factory", "construction", "biotech", "architecture", 
      "settings", "build", "engineering", "hardware", "handyman", "manufacturing", "oil_barrel", "power",
      "precision_manufacturing", "rebase_edit", "robot_2", "robot", "vertical_align_center", "vertical_align_bottom",
      "vertical_align_top", "water_drop", "webhook", "terminal", "square_foot", "straight", "rule", "straighten"
    ],
    "Logistics & Inventory": [
      "local_shipping", "inventory_2", "package", "forklift", "warehouse", "delivery_dining", "shipping", 
      "trolley", "conveyor_belt", "box", "package_2", "inventory", "shelves", "pallet", "barcode_scanner",
      "qr_code_2", "qr_code", "qr_code_scanner", "shopping_cart", "store", "moving", "conveyor_belt"
    ],
    "Quality & Trust": [
      "verified", "workspace_premium", "verified_user", "security", "check_circle", "new_releases", 
      "stars", "award_star", "shield", "policy", "gpp_good", "task_alt", "grade", "approval_delegation",
      "fact_check", "how_to_reg", "lock", "lock_open", "vpn_key", "admin_panel_settings", "assignment_turned_in"
    ],
    "Analytics & Growth": [
      "query_stats", "trending_up", "analytics", "assessment", "monitoring", "pie_chart", "show_chart", 
      "leaderboard", "insert_chart", "stacked_line_chart", "equalizer", "area_chart", "bar_chart", "timeline",
      "bubble_chart", "multiline_chart", "legend_toggle", "data_exploration", "insights", "finance_mode"
    ],
    "Safety & Security": [
      "health_and_safety", "emergency", "warning", "error", "dangerous", "report", "crisis_alert",
      "safety_check", "shield_moon", "privacy_tip", "lock_person", "lock_reset", "encrypted", "enhanced_encryption",
      "sensor_door", "sensor_window", "fire_extinguisher", "gas_meter", "medical_services", "first_aid"
    ],
    "Tools & Repair": [
      "mending_machine", "carpenter", "plumbing", "electrical_services", "construction", "auto_repair",
      "home_repair_service", "misc_services", "cleaning_services", "sanitizer", "iron", "format_paint",
      "brush", "palette", "layers", "architecture", "design_services", "imagesearch_roller"
    ],
    "Communication & Web": [
      "public", "language", "translate", "mail", "send", "chat", "forum", "call", "contact_phone",
      "alternate_email", "mark_as_unread", "contact_mail", "contacts", "rss_feed", "share", "hub",
      "cloud", "cloud_done", "cloud_upload", "cloud_download", "wifi", "network_check"
    ],
    "General Utilities": [
      "schedule", "timer", "speed", "groups", "handshake", "eco", "lightbulb", "visibility", "search", 
      "home", "manage_accounts", "military_tech", "notifications", "settings_input_component", "extension",
      "bolt", "auto_awesome", "favorite", "star", "thumb_up", "launch", "open_in_new", "link", "attach_file",
      "save", "download", "print", "share", "more_vert", "more_horiz", "refresh", "sync", "history"
    ],
    "Hardware & Energy": [
      "battery_full", "electric_bolt", "bolt", "energy_savings_leaf", "solar_power", "wind_power",
      "propane_tank", "oil_barrel", "ev_station", "dock", "computer", "desktop_windows", "laptop",
      "device_hub", "memory", "cpu", "router", "cast", "videogame_asset", "speaker", "keyboard"
    ],
    "Transport & Vehicles": [
      "local_shipping", "flight", "train", "directions_bus", "directions_car", "two_wheeler",
      "electric_car", "airport_shuttle", "fire_truck", "sailing", "directions_boat",
      "local_taxi", "departure_board", "rv_hookup", "agriculture", "forklift",
      "minor_crash", "electric_scooter", "pedal_bike", "directions_railway_filled"
    ],
    "Packaging & Containers": [
      "inventory_2", "package_2", "all_inbox", "move_to_inbox", "archive",
      "unarchive", "inbox", "outbox", "takeout_dining", "shopping_bag",
      "luggage", "no_luggage", "backpack", "card_giftcard", "redeem",
      "wrapped_gift", "liquor", "blender", "kitchen", "propane"
    ],
    "Documentation & Files": [
      "description", "article", "feed", "summarize", "note", "notes",
      "sticky_note_2", "post_add", "edit_note", "request_page",
      "find_in_page", "file_copy", "file_present", "topic", "folder_open",
      "folder_zip", "snippet_folder", "drive_file_rename_outline",
      "text_snippet", "content_paste_search"
    ],
    "Certificates & Awards": [
      "workspace_premium", "military_tech", "emoji_events", "card_membership",
      "stars", "school", "menu_book", "chrome_reader_mode", "import_contacts",
      "auto_stories", "collections_bookmark", "bookmark_added",
      "verified_user", "how_to_reg", "badge", "approval",
      "document_scanner", "assignment_ind", "co_present", "rewarded_ads"
    ],
    "Policy & Compliance": [
      "policy", "gavel", "balance", "account_balance", "privacy_tip",
      "rule_folder", "rule", "domain_verification", "approval_delegation",
      "content_paste_go", "rate_review", "grading", "fact_check",
      "assignment_late", "assignment_returned", "pending_actions",
      "history_edu", "receipt_long", "library_books", "class"
    ],
    "Lab & Science": [
      "science", "biotech", "vaccines", "medication", "medical_information",
      "health_and_safety", "bloodtype", "coronavirus", "microbiology",
      "labs", "experiment", "water_drop", "air", "filter_drama",
      "grain", "pest_control", "pest_control_rodent", "yard",
      "compost", "energy_savings_leaf"
    ],
    "Equipment & Machinery": [
      "precision_manufacturing", "mending_machine", "heat_pump",
      "dishwasher", "washing_machine", "countertops", "microwave",
      "blender", "coffee_maker", "rice_bowl", "gas_meter",
      "oil_barrel", "propane_tank", "electrical_services",
      "plumbing", "home_repair_service", "handyman",
      "carpenter", "hardware", "construction"
    ],
    "Components & Parts": [
      "memory", "developer_board", "device_hub", "cable", "usb",
      "settings_input_component", "settings_input_hdmi", "settings_input_svideo",
      "router", "hub", "dns", "account_tree", "schema",
      "workspaces", "extension", "widgets", "toys",
      "integration_instructions", "mediation", "join_inner"
    ],
    "Products & Goods": [
      "inventory", "shelves", "storefront", "local_mall", "sell",
      "price_check", "price_change", "shopping_basket", "add_shopping_cart",
      "remove_shopping_cart", "production_quantity_limits",
      "discount", "new_releases", "featured_seasonal_and_gifts",
      "category", "label", "loyalty", "card_giftcard",
      "attach_money", "currency_rupee"
    ],
    "GST & Finance": [
      "currency_rupee", "account_balance_wallet", "payments",
      "receipt", "receipt_long", "point_of_sale", "request_quote",
      "calculate", "percent", "money", "monetization_on",
      "price_change", "price_check", "paid", "savings",
      "account_balance", "credit_card", "invoice", "finance",
      "finance_mode"
    ],
    "Application & UI Icons": [
      "apps", "grid_view", "dashboard", "space_dashboard", "view_module",
      "view_list", "view_carousel", "view_day", "web", "web_asset",
      "browser_updated", "open_in_browser", "install_desktop",
      "install_mobile", "app_registration", "app_shortcut",
      "phone_iphone", "tablet_android", "desktop_mac", "laptop_mac"
    ],
    "Key Points & Highlights": [
      "push_pin", "location_on", "place", "flag", "outlined_flag",
      "tour", "anchor", "bookmark", "bookmarks", "label_important",
      "new_label", "loyalty", "star_rate", "grade", "flare",
      "lens", "adjust", "radio_button_checked", "brightness_1",
      "circle"
    ]
  };

  const allIcons = Object.values(categories).flat();
  const filteredIcons = searchQuery.trim() === "" 
    ? allIcons 
    : allIcons.filter(icon => icon.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300 ring-1 ring-black/5">
        <div className="p-8 sm:p-10 space-y-8">
          {/* Header & Search */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <h3 className="text-2xl font-black text-black tracking-tighter uppercase">Select Icon</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Premium Material Symbols</p>
               </div>
               <button 
                onClick={onClose} 
                className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-black hover:bg-slate-100 rounded-full flex items-center justify-center transition-all cursor-pointer"
               >
                 <span className="material-symbols-outlined text-xl">close</span>
               </button>
            </div>

            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-orange-500 transition-colors">search</span>
              <input 
                type="text" 
                placeholder="Search over 400 icons..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-semibold outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-300"
                autoFocus
              />
            </div>
          </div>
          
          {/* Icon Grid */}
          <div className="max-h-[50vh] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
            {searchQuery.trim() === "" ? (
               <div className="space-y-10">
                 {Object.entries(categories).map(([category, icons]) => (
                   <div key={category} className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="h-[1px] flex-1 bg-slate-100"></div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{category}</h4>
                        <div className="h-[1px] flex-1 bg-slate-100"></div>
                     </div>
                     <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                        {icons.map((icon, idx) => (
                          <button 
                            key={`${icon}-${idx}`}
                            onClick={() => onSelect(icon)}
                            className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:shadow-orange-600/20"
                            title={icon}
                          >
                            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">{icon}</span>
                          </button>
                        ))}
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 min-h-[300px]">
                {filteredIcons.length > 0 ? filteredIcons.map((icon, idx) => (
                  <button 
                    key={`${icon}-${idx}`}
                    onClick={() => onSelect(icon)}
                    className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:shadow-orange-600/20"
                    title={icon}
                  >
                    <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">{icon}</span>
                  </button>
                )) : (
                  <div className="col-span-full py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-lg font-black text-black">No matches found</p>
                        <p className="text-xs font-medium text-slate-400">Try searching for generic terms like "gear" or "home"</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               {allIcons.length} Icons Ready
            </div>
            <button 
                onClick={onClose} 
                className="bg-black text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
            >
                Close Picker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIconPicker;
