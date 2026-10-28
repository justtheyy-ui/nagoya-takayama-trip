export type TripEvent = { time: string; title: string; detail: string };
export type TripDay = { date: string; week: string; city: string; status: string; events: TripEvent[]; alt: string; reminder: string };
export type TripTodo = { id: string; due: string; title: string; priority: "高" | "中" | "低"; note: string; done: boolean };
export type BudgetItem = { label: string; you: number; friend: number; fixed?: boolean };

export const defaultDays: TripDay[] = [
  {date:"1/6",week:"WED",city:"名古屋站",status:"住宿已订 · 活动拟定",events:[{time:"出发前",title:"前往香港机场",detail:"检查护照、行李规格与机场交通"},{time:"19:45",title:"抵达中部机场 T2",detail:"入境后乘名铁前往名古屋站"},{time:"21:30 后",title:"酒店入住 / 夜宵",detail:"不安排高价餐厅；航班延误则直达酒店"}],alt:"航班延误：删掉夜宵安排，优先赶末班交通。",reminder:"首晚酒店具体名称仍需补齐；核对末班机场车。"},
  {date:"1/7",week:"THU",city:"高山 · RIKKA HANASATO",status:"住宿已订 · 巴士待订",events:[{time:"09:45 参考",title:"名古屋 → 高山",detail:"高速巴士预计 12:20 抵达；2027 班表待复核"},{time:"12:30",title:"高山酱油拉面",detail:"到站后简餐并处理行李"},{time:"14:00—17:30",title:"三町老街 / 阵屋 / 超市",detail:"采购飞驒牛与蔬菜"},{time:"18:00",title:"民宿飞驒牛 DIY",detail:"寿喜烧或煎牛排，两人分摊食材"}],alt:"天气差：咖啡馆 + 超市 + 提前入住。",reminder:"确认自助入住、寄存、冬季制热与浴室温度。"},
  {date:"1/8",week:"FRI",city:"朴之木平 · 平汤",status:"主线优先 · 时刻待核",events:[{time:"08:40 参考",title:"高山 → 朴之木平",detail:"浓飞巴士；先核冬季时刻"},{time:"上午—午后",title:"朴之木平滑雪",detail:"林间道为主；雪场吃咖喱 / 乌冬"},{time:"下午",title:"朴之木平 → 平汤",detail:"若班次顺利，去ひらゆの森泡汤"},{time:"16:30 左右",title:"平汤 → 高山",detail:"优先赶早回程，不赌末班"}],alt:"时间不够：改泡雪场内宿儺の湯，直接回高山。",reminder:"缆车、雪具、雪服分开计费；雪マジ资格未确认。"},
  {date:"1/9",week:"SAT",city:"白川乡 · 高山",status:"目的地确定 · 车票待订",events:[{time:"早班",title:"高山 → 白川乡",detail:"成人节连休周六，优先预约或提前排队"},{time:"中午",title:"荞麦面 / 乡土定食",detail:"控制用餐时间，留给雪景与合掌村"},{time:"15:15 参考",title:"白川乡 → 高山",detail:"优先锁定回程；具体班次待核"},{time:"晚上",title:"飞驒牛烧肉三选一",detail:"和牛将军 / 焼肉 高 / ひだし"}],alt:"回程晚：烧肉挪到 1/10，不预付不可退款套餐。",reminder:"浓飞 3 日券不能坐白川乡预约制班次。"},
  {date:"1/10",week:"SUN",city:"高山 · 自由选择",status:"二选一待定",events:[{time:"上午 A",title:"宫川朝市 + 三町老街",detail:"轻松逛街、咖啡与伴手礼"},{time:"上午 B",title:"第二次滑雪",detail:"首滑体力和雪况好再决定"},{time:"中午",title:"朴叶味噌 / 牛肉寿司",detail:"随当天版本选择"},{time:"晚上",title:"MEMOIRE 或平价餐",detail:"也可承接前一晚延后的烧肉"}],alt:"二滑时取消餐厅硬预约；市区版保留高山慢游。",reminder:"周日晚店铺休息较多；整理行李。"},
  {date:"1/11",week:"MON",city:"名古屋荣 · BASE LAYER",status:"住宿已订 · 巴士待订",events:[{time:"10:00 参考",title:"高山 → 名古屋",detail:"成人节假日，车次与余票待核"},{time:"中午",title:"名古屋站宽面 / 鸡肉饭",detail:"抵达后快速用餐"},{time:"下午",title:"鬼塚虎 → 荣寄存 → MUJI",detail:"人多时调整先后顺序"},{time:"晚上",title:"名古屋鳗鱼三吃",detail:"两人可分别点迷你份与正常份"}],alt:"名古屋站太挤：先去荣寄存，改逛酒店附近店铺。",reminder:"核对新酒店订单、开业状态与寄存条件。"},
  {date:"1/12",week:"TUE",city:"名古屋荣 · 大须",status:"购物主线 · 餐厅待订",events:[{time:"上午",title:"Komeda 早餐 + 荣商圈",detail:"MUJI / 美妆 / 服饰按清单逛"},{time:"中午",title:"分开午餐",detail:"你：鮨 成琉；朋友：平价定食"},{time:"下午",title:"大须古着 / Loft / BEAMS",detail:"二手店通常下午开门"},{time:"晚上",title:"印度咖喱 + 芝士馕",detail:"蟹腿料理作为备选"}],alt:"天气好想看灯光活动：从购物时段中腾时间。",reminder:"先吃寿司再逛；不同游客券不默认叠加。"},
  {date:"1/13",week:"WED",city:"中部机场 T2",status:"航班已订 · 车次待定",events:[{time:"10:00—10:30",title:"退房",detail:"从荣经金山前往机场"},{time:"中午",title:"机场简餐 / 退税核验",detail:"商品托运前完成必要核验"},{time:"15:25",title:"航班起飞",detail:"T2 步行和值机留足时间"}],alt:"退税排队或交通延误：缩短机场用餐。",reminder:"确认退税退款方式；无信用卡时提前问渠道。"}
];

export const defaultTodos: TripTodo[] = [
  ["passport","2027-01-01","检查护照、签证及香港往返机场方式","高","签证预算约 ¥1,000 / 人；付款状态另核"],
  ["esim","2027-01-01","开通日本移动网络与短信","中","部分优惠注册可能需要短信"],
  ["snow","2027-01-02","核对朴之木平开放雪道与雪况","高","Panorama / Air Turn 以当天开放为准"],
  ["yukimaji","2027-01-02","确认雪マジ学生证核验资格","高","未确认前不从预算扣缆车票"],
  ["rental","2027-01-02","确认雪具雪服租赁包含内容","中","头盔、护目镜、手套可能另付"],
  ["ski-bus","2027-01-03","核对滑雪日冬季巴士时刻","高","高山 → 朴之木平 → 平汤 → 高山"],
  ["first-hotel","2027-01-06","补齐首晚酒店入住信息","高","住宿费用已确定，当前记录不完整"],
  ["bus-out","2027-01-07","订名古屋 → 高山巴士","高","开售期与付款渠道待核"],
  ["rikka","2027-01-07","确认 RIKKA 入住、取暖与寄存","高","关注冬季体感"],
  ["pass","2027-01-07","决定是否购买浓飞巴士 3 日券","高","与白川乡非预约排队风险一起判断"],
  ["shirakawa","2027-01-09","确认白川乡去回程班次","高","连休周六，回程优先"],
  ["return-bus","2027-01-11","订高山 → 名古屋巴士","高","成人节假日，参考 10:00 发"],
  ["base-layer","2027-01-11","核对 BASE LAYER 订单与寄存","高","新酒店开业信息需确认"],
  ["sushi","2027-01-12","确认鮨 成琉午餐菜单与预约","中","不默认特上鱼料内容"],
  ["tax","2027-01-13","确认 T2 退税与退款渠道","高","商品托运前核验"]
].map(([id,due,title,priority,note])=>({id,due,title,priority:priority as "高"|"中"|"低",note,done:false}));

export const defaultBudget: BudgetItem[] = [
  {label:"机票",you:1200,friend:1200,fixed:true},{label:"住宿",you:1287,friend:1287,fixed:true},{label:"签证",you:1000,friend:1000},{label:"交通",you:812,friend:812},{label:"滑雪缆车",you:168,friend:168},{label:"雪具雪服",you:311,friend:311},{label:"温泉",you:29,friend:29},{label:"餐饮",you:2400,friend:1400},{label:"购物",you:1200,friend:500},{label:"预备金",you:500,friend:400}
];

export const places = [
  ["01","中部国际机场 T2","抵达、返程与退税核验","Chubu Centrair International Airport Terminal 2, Tokoname, Aichi, Japan"],
  ["02","高山浓飞巴士中心","滑雪、平汤、白川乡与名古屋换乘","Takayama Nohi Bus Center, Takayama, Gifu, Japan"],
  ["03","RIKKA HANASATO","1/7—1/11 四晚民宿","4-10-13 Hanasatomachi, Takayama, Gifu, Japan"],
  ["04","朴之木平滑雪场","林间道与雪山景观","Hounoki Daira Ski Resort, Takayama, Gifu, Japan"],
  ["05","白川乡合掌村","1/9 雪景日归","Shirakawa-go, Gifu, Japan"],
  ["06","大须商店街","古着、中古与街区散步","Osu Shopping Street, Nagoya, Japan"]
];
