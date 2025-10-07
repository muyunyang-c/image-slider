// 获取DOM元素 - 主滑块容器、标题和缩略图轮播容器
const slider = document.getElementById("slider");
const slideTitle = document.querySelector(".slide-title");
const thumbnailWheel = document.querySelector(".thumbnail-wheel");

// 配置参数 - 幻灯片数量、缩放比例、尺寸计算
const totalSlides = 20;           // 总幻灯片数量
const endScale = 5;               // 最大缩放比例
let slideWidth = window.innerWidth * 0.45;  // 幻灯片宽度（桌面端45%视口宽度）
let viewportCenter = window.innerWidth / 2; // 视口中心点
let isMobile = window.innerWidth < 1000;    // 移动端检测

// 幻灯片标题数组 - 对应20张图片的标题
const slideTitles = [
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
  "Request in progress",
];

// 动画状态变量 - 位置追踪和滚动状态
let currentX = 0;        // 当前X轴位置
let targetX = 0;         // 目标X轴位置
let isScrolling = false; // 是否正在滚动
let scrollTimeout;       // 滚动超时定时器
let activeSlideIndex = 0; // 当前激活的幻灯片索引

/**
 * 创建幻灯片元素
 * 生成3倍数量的幻灯片用于无缝循环滚动
 */
function createSlides() {
  for (let i = 0; i < totalSlides * 3; i++) {
    const slide = document.createElement("div");
    slide.className = "slide";

    const img = document.createElement("img");
    const imageNumber = (i % totalSlides) + 1;  // 循环使用1-20的图片
    img.src = `./slide/1 (${imageNumber}).jpg`;     // 使用相对路径加载图片 - 从slide子文件夹加载

    slide.appendChild(img);
    slider.appendChild(slide);
  }
}

/**
 * 初始化滑块位置
 * 设置所有幻灯片的初始位置，居中显示第一张
 */
function initializeSlider() {
  const slides = document.querySelectorAll(".slide");

  slides.forEach((slide, index) => {
    const x = index * slideWidth - slideWidth;  // 每张幻灯片间隔slideWidth像素
    gsap.set(slide, { x: x });  // 使用GSAP设置初始位置
  });

  // 计算居中对齐的偏移量
  const centerOffset = window.innerWidth / 2 - slideWidth / 2;
  currentX = centerOffset;  // 设置当前位置
  targetX = centerOffset;   // 设置目标位置
}

createSlides();
initializeSlider();

/**
 * 处理鼠标滚轮事件
 * @param {Event} e - 滚轮事件对象
 */
function handleScroll(e) {
  const scrollIntensity = e.deltaY || e.detail || e.wheelDelta * -1;  // 获取滚动强度
  targetX -= scrollIntensity * 1;  // 根据滚动方向调整目标位置

  isScrolling = true;  // 设置滚动状态
  clearTimeout(scrollTimeout);  // 清除之前的超时

  // 设置滚动结束检测
  scrollTimeout = setTimeout(() => {
    isScrolling = false;  // 150ms后认为滚动结束
  }, 150);
}

/**
 * 主动画循环函数
 * 处理幻灯片位置更新和无限循环滚动
 */
function animate() {
  currentX += (targetX - currentX) * 0.1;  // 平滑缓动到目标位置

  const totalWidth = totalSlides * slideWidth;  // 总宽度
  
  // 实现无限循环滚动 - 当超出边界时重置位置
  if (currentX > 0) {
    currentX -= totalWidth;  // 向左超出时重置到右侧
    targetX -= totalWidth;
  } else if (currentX < -totalWidth) {
    currentX += totalWidth;  // 向右超出时重置到左侧
    targetX += totalWidth;
  }

  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide, index) => {
    const x = index * slideWidth + currentX;  // 计算每张幻灯片的位置
    gsap.set(slide, { x: x });  // 使用GSAP设置位置
  });

  requestAnimationFrame(animate);  // 继续下一帧动画
}

/**
 * 事件监听器初始化
 * 设置滚轮事件和滚动行为控制
 */

// 添加滚轮事件监听器 - 支持标准滚轮和Firefox DOMMouseScroll
window.addEventListener("wheel", handleScroll, { passive: false });
window.addEventListener("DOMMouseScroll", handleScroll, { passive: false });

// 阻止页面默认滚动行为 - 保持滑块在视口内
window.addEventListener(
  "scroll",
  function (e) {
    if (e.target === document || e.target === document.body) {
      window.scrollTo(0, 0);  // 重置滚动位置到顶部
    }
  },
  { passive: false }
);

// 启动动画循环
animate();

/**
 * 窗口大小调整处理
 * 当窗口大小改变时重新计算尺寸和重新初始化
 */
window.addEventListener('resize', () => {
  // 重新计算尺寸参数
  slideWidth = window.innerWidth * 0.45;
  viewportCenter = window.innerWidth / 2;
  isMobile = window.innerWidth < 1000;
  
  // 重新初始化滑块和缩略图
  initializeSlider();
  updateThumbnailItems();
});

/**
 * 增强版动画循环函数（带缩放效果和标题更新）
 * 处理幻灯片位置、缩放动画、透视效果和标题更新
 */
function animate() {
  currentX += (targetX - currentX) * 0.1;  // 平滑缓动到目标位置

  const totalWidth = totalSlides * slideWidth;  // 总宽度
  
  // 实现无限循环滚动 - 当超出边界时重置位置
  if (currentX > 0) {
    currentX -= totalWidth;  // 向左超出时重置到右侧
    targetX -= totalWidth;
  } else if (currentX < -totalWidth) {
    currentX += totalWidth;  // 向右超出时重置到左侧
    targetX += totalWidth;
  }

  let centerSlideIndex = 0;  // 最靠近中心的幻灯片索引
  let closestToCenter = Infinity;  // 最小距离记录
  
  const slides = document.querySelectorAll(".slide");

  slides.forEach((slide, index) => {
    const x = index * slideWidth + currentX;  // 计算幻灯片位置
    gsap.set(slide, { x: x });  // 设置位置

    // 计算缩放效果 - 基于与视口中心的距离
    const slideCenterX = x + slideWidth / 2;  // 幻灯片中心点
    const distanceFromCenter = Math.abs(slideCenterX - viewportCenter);  // 与视口中心的距离

    const outerDistance = slideWidth * 3;  // 影响范围
    const progress = Math.min(distanceFromCenter / outerDistance, 1);  // 计算进度（0-1）

    // 使用缓动函数使缩放更自然
    const easedProgress =
    progress < 0.5
        ? 2 * progress * progress  // 前半段：二次方缓入
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;  // 后半段：二次方缓出

    const scale = 1 + easedProgress * (endScale - 1);  // 计算最终缩放值

    // 应用缩放效果到图片
    const img = slide.querySelector("img");
    gsap.set(img, { scale: scale });
    
    // 找到最靠近中心的幻灯片用于更新标题
    if (distanceFromCenter < closestToCenter) {
      closestToCenter = distanceFromCenter;
      centerSlideIndex = index % totalSlides;  // 取模确保索引在有效范围内
    }
  });

  // 更新标题为当前最中心幻灯片的标题
  const currentTitleIndex = centerSlideIndex;
  slideTitle.textContent = slideTitles[currentTitleIndex];

  // 更新缩略图位置
  updateThumbnailItems();
  
  requestAnimationFrame(animate);  // 继续下一帧动画
}

/**
 * 创建缩略图元素
 * 在圆形轨道上排列所有幻灯片的缩略图
 */
function createThumbnailItems() {
  for (let i = 0; i < totalSlides; i++) {
    // 计算圆形轨道的角度和位置
    const angle = (i / totalSlides) * Math.PI * 2;  // 将索引转换为弧度角度
    const radius = isMobile ? 150 : 350;  // 根据设备类型选择半径
    const x = radius * Math.cos(angle) + window.innerWidth / 2;  // X坐标
    const y = radius * Math.sin(angle) + window.innerHeight / 2 - 25;  // Y坐标（稍微上移）

    // 创建缩略图容器
    const thumbnail = document.createElement("div");
    thumbnail.className = "thumbnail-item";
    thumbnail.dataset.index = i;  // 存储索引用于后续引用
    thumbnail.dataset.angle = angle;  // 存储基础角度
    thumbnail.dataset.radius = radius;  // 存储半径

    // 创建图片元素
    const img = document.createElement("img");
    const imageNumber = i + 1;
    img.src = `./slide/1 (${imageNumber}).jpg`;  // 加载对应缩略图 - 从slide子文件夹加载
    thumbnail.appendChild(img);

    // 使用GSAP设置位置和变换原点
    gsap.set(thumbnail, {
      x,
      y,
      transformOrigin: "center center",  // 以中心点为变换原点
    });

    thumbnailWheel.appendChild(thumbnail);
  }
}

createThumbnailItems();

/**
 * 更新缩略图位置
 * 根据主幻灯片的滚动进度旋转缩略图轨道
 */
function updateThumbnailItems() {
  // 计算精确的滚动进度（0-1之间）
  const exactSlideProgress = Math.abs(currentX) / slideWidth;
  // 计算当前旋转角度（负值用于顺时针旋转，+90度用于顶部起始）
  const currentRotationAngle = -(exactSlideProgress * (360 / totalSlides)) + 90;

  const thumbnails = document.querySelectorAll(".thumbnail-item");
  thumbnails.forEach((thumbnail) => {
    // 获取存储的基础角度和半径
    const baseAngle = parseFloat(thumbnail.dataset.angle);
    const radius = isMobile ? 150 : 300;
    
    // 计算当前实际角度（基础角度 + 滚动旋转）
    const currentAngle = baseAngle + (currentRotationAngle * Math.PI) / 180;

    // 计算新的XY坐标
    const x = radius * Math.cos(currentAngle) + window.innerWidth / 2;
    const y = radius * Math.sin(currentAngle) + window.innerHeight / 2 - 25;

    // 使用GSAP更新位置
    gsap.set(thumbnail, {
      x: x,
      y: y,
      rotation: 0,
      transformOrigin: "center center",
    });
  });
}

