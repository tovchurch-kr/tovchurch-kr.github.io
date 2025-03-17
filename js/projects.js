/**
 * TOV 종합건축 프로젝트 슬라이더 JavaScript (단순화 버전)
 */

// 현재 필터 및 슬라이더 상태
let currentFilter = 'all';
let currentSlide = 0;
let slideInterval;
const slideDelay = 5000; // 5초마다 슬라이드 전환

// 각 카테고리별 이미지 미리 정의
const projectImages = {
    // 주거 프로젝트 이미지
    residential: [
        { path: 'images/residential/1.jpg', category: 'residential' },
        { path: 'images/residential/2.jpg', category: 'residential' },
    ],
    
    // 상업 프로젝트 이미지
    commercial: [
        { path: 'images/commercial/1.jpg', category: 'commercial' },
        { path: 'images/commercial/2.jpg', category: 'commercial' },
    ],
    
    // 공공 프로젝트 이미지
    public: [
        { path: 'images/public/1.jpg', category: 'public' },
        { path: 'images/public/2.jpg', category: 'public' },
    ]
};

// DOM이 로드되면 슬라이더 초기화
document.addEventListener('DOMContentLoaded', initProjectSlider);

/**
 * 슬라이더 초기화 함수
 */
function initProjectSlider() {
    // 필요한 DOM 요소 가져오기
    const filterBtns = document.querySelectorAll('.filter-btn');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    // 필터 버튼 이벤트 리스너
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 활성화된 버튼 스타일 변경
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 필터 업데이트 및 슬라이더 리로드
            currentFilter = btn.getAttribute('data-filter');
            currentSlide = 0;
            
            // 필터링된 프로젝트 로드
            loadFilteredProjects();
            resetSlideInterval();
        });
    });
    
    // 이전/다음 버튼 이벤트 리스너
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToPrevSlide();
            resetSlideInterval();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToNextSlide();
            resetSlideInterval();
        });
    }
    
    // 터치 스와이프 지원 (모바일)
    setupTouchSwipe();
    
    // 첫 로딩 시 프로젝트 로드
    loadFilteredProjects();
    
    // 자동 슬라이드 시작
    startSlideInterval();
}

/**
 * 터치 스와이프 설정
 */
function setupTouchSwipe() {
    const slider = document.querySelector('.project-slider');
    if (!slider) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // 왼쪽으로 스와이프 (다음 슬라이드)
            goToNextSlide();
            resetSlideInterval();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // 오른쪽으로 스와이프 (이전 슬라이드)
            goToPrevSlide();
            resetSlideInterval();
        }
    }, { passive: true });
}

/**
 * 필터링된 프로젝트 로드
 */
function loadFilteredProjects() {
    const slider = document.querySelector('.project-slider');
    const paginationContainer = document.querySelector('.slider-pagination');
    
    if (!slider || !paginationContainer) return;
    
    // 슬라이더 및 페이지네이션 초기화
    slider.innerHTML = '';
    paginationContainer.innerHTML = '';
    
    // 프로젝트 이미지 가져오기
    const projects = getProjectsByFilter(currentFilter);
    
    // 슬라이드가 없을 경우 메시지 표시
    if (projects.length === 0) {
        slider.innerHTML = '<div class="no-projects">이 카테고리에는 프로젝트가 없습니다.</div>';
        return;
    }
    
    // 슬라이드 생성
    projects.forEach((project, index) => {
        createProjectSlide(slider, project, index === 0);
    });
    
    // 페이지네이션 도트 생성
    createPaginationDots(paginationContainer, projects.length);
    
    // 슬라이더 업데이트
    updateSlider();
}

/**
 * 현재 필터에 맞는 프로젝트 목록 가져오기
 */
function getProjectsByFilter(filter) {
    if (filter === 'all') {
        // 모든 카테고리의 이미지 반환
        return [
            ...projectImages.residential,
            ...projectImages.commercial,
            ...projectImages.public
        ];
    } else if (filter === 'residential') {
        return projectImages.residential;
    } else if (filter === 'commercial') {
        return projectImages.commercial;
    } else if (filter === 'public') {
        return projectImages.public;
    }
    
    return [];
}

/**
 * 프로젝트 슬라이드 생성
 */
function createProjectSlide(slider, project, isActive) {
    const slide = document.createElement('div');
    slide.className = `project-slide ${isActive ? 'active' : ''}`;
    slide.setAttribute('data-category', project.category);
    
    slide.innerHTML = `
        <div class="project-slide-img-container">
            <img src="${project.path}" alt="프로젝트 이미지" class="project-slide-img">
        </div>
    `;
    
    slider.appendChild(slide);
}

/**
 * 페이지네이션 도트 생성
 */
function createPaginationDots(container, slideCount) {
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('div');
        dot.className = `pagination-dot ${i === currentSlide ? 'active' : ''}`;
        dot.setAttribute('data-index', i);
        
        dot.addEventListener('click', () => {
            currentSlide = i;
            updateSlider();
            resetSlideInterval();
        });
        
        container.appendChild(dot);
    }
}

/**
 * 슬라이더 업데이트
 */
function updateSlider() {
    const slides = document.querySelectorAll('.project-slide');
    const dots = document.querySelectorAll('.pagination-dot');
    
    if (slides.length === 0) return;
    
    // 모든 슬라이드 비활성화
    slides.forEach(slide => slide.classList.remove('active'));
    
    // 현재 슬라이드 활성화
    slides[currentSlide].classList.add('active');
    
    // 페이지네이션 도트 업데이트
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

/**
 * 이전 슬라이드로 이동
 */
function goToPrevSlide() {
    const slides = document.querySelectorAll('.project-slide');
    if (slides.length === 0) return;
    
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
}

/**
 * 다음 슬라이드로 이동
 */
function goToNextSlide() {
    const slides = document.querySelectorAll('.project-slide');
    if (slides.length === 0) return;
    
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}

/**
 * 자동 슬라이드 시작
 */
function startSlideInterval() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    
    slideInterval = setInterval(goToNextSlide, slideDelay);
}

/**
 * 자동 슬라이드 리셋
 */
function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideInterval();
}