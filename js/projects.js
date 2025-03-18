/**
 * TOV 종합건축 - 프로젝트 섹션 JavaScript (즉시 로딩 방식)
 */

// 전역 변수
let currentSlide = 0;
let currentFilter = 'all';

// 페이지 로드 시 모든 컨텐츠를 즉시 초기화
document.addEventListener('DOMContentLoaded', () => {
    const projectSection = document.getElementById('projects');
    if (!projectSection) return;
    
    console.log('프로젝트 섹션을 초기화합니다.');
    
    // 모든 이미지를 즉시 로드 설정
    preloadAllImages();
    
    // 필터 버튼 이벤트 연결
    initFilterButtons();
    
    // 슬라이더 컨트롤 이벤트 연결
    initSliderControls();
    
    // 페이지네이션 이벤트 연결
    initPaginationEvents();
    
    // 초기 필터 설정
    filterSlides('all');
});

/**
 * 모든 이미지 즉시 로드
 */
function preloadAllImages() {
    // 모든 프로젝트 이미지 요소 선택
    const projectImages = document.querySelectorAll('.project-slide-img');
    
    projectImages.forEach(img => {
        // 지연 로딩 속성이 있다면 제거
        if (img.hasAttribute('loading')) {
            img.removeAttribute('loading');
        }
        
        // 데이터 소스 속성이 있다면 실제 src로 변환
        if (img.hasAttribute('data-src')) {
            const actualSrc = img.getAttribute('data-src');
            img.setAttribute('src', actualSrc);
            img.removeAttribute('data-src');
        }
        
        // 이미지 로드 완료 확인
        if (!img.complete) {
            img.onload = function() {
                console.log('이미지 로드 완료:', img.src);
            };
        }
    });
    
    console.log('모든 프로젝트 이미지 로드 시작');
}

/**
 * 필터 버튼 초기화
 */
function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 이미 활성화된 필터면 중복 실행 방지
            if (this.classList.contains('active')) return;
            
            // 버튼 활성화 상태 변경
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 필터 적용
            const filterValue = this.getAttribute('data-filter');
            filterSlides(filterValue);
        });
    });
}

/**
 * 슬라이더 컨트롤 초기화
 */
function initSliderControls() {
    // 이전 버튼
    const prevBtn = document.querySelector('.slider-btn.prev');
    if (prevBtn) {
        prevBtn.addEventListener('click', showPreviousSlide);
    }
    
    // 다음 버튼
    const nextBtn = document.querySelector('.slider-btn.next');
    if (nextBtn) {
        nextBtn.addEventListener('click', showNextSlide);
    }
    
    // 터치 스와이프 설정
    setupTouchSwipe();
}

/**
 * 터치 스와이프 설정
 */
function setupTouchSwipe() {
    const slider = document.querySelector('.project-slider');
    if (!slider || !('ontouchstart' in window)) return;
    
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
            showNextSlide();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // 오른쪽으로 스와이프 (이전 슬라이드)
            showPreviousSlide();
        }
    }, { passive: true });
}

/**
 * 필터 기준으로 슬라이드 표시/숨김
 */
function filterSlides(filter) {
    // 필터 값 업데이트
    currentFilter = filter;
    
    // 슬라이드 필터링 (한 번만 DOM 쿼리)
    const allSlides = document.querySelectorAll('.project-slide');
    
    // 모든 슬라이드 숨기기
    allSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // 현재 필터에 맞는 슬라이드 찾기
    const filteredSlides = currentFilter === 'all' 
        ? allSlides 
        : document.querySelectorAll(`.project-slide.${currentFilter}`);
    
    // 슬라이드가 없으면 종료
    if (filteredSlides.length === 0) return;
    
    // 첫 번째 슬라이드 표시
    currentSlide = 0;
    filteredSlides[currentSlide].classList.add('active');
    
    // 페이지네이션 업데이트
    updatePagination();
    
    console.log(`필터링 적용: ${filter}, 표시 슬라이드 수: ${filteredSlides.length}`);
}

/**
 * 이전 슬라이드 표시
 */
function showPreviousSlide() {
    // 필터링된 슬라이드 가져오기
    const filteredSlides = getFilteredSlides();
    if (filteredSlides.length <= 1) return; // 슬라이드가 1개 이하면 작동 안함
    
    // 현재 슬라이드 비활성화
    filteredSlides[currentSlide].classList.remove('active');
    
    // 이전 슬라이드 인덱스 계산
    currentSlide = (currentSlide - 1 + filteredSlides.length) % filteredSlides.length;
    
    // 새 슬라이드 활성화
    filteredSlides[currentSlide].classList.add('active');
    
    // 페이지네이션 업데이트
    updatePagination();
    
    console.log(`이전 슬라이드로 이동: ${currentSlide}`);
}

/**
 * 다음 슬라이드 표시
 */
function showNextSlide() {
    // 필터링된 슬라이드 가져오기
    const filteredSlides = getFilteredSlides();
    if (filteredSlides.length <= 1) return; // 슬라이드가 1개 이하면 작동 안함
    
    // 현재 슬라이드 비활성화
    filteredSlides[currentSlide].classList.remove('active');
    
    // 다음 슬라이드 인덱스 계산
    currentSlide = (currentSlide + 1) % filteredSlides.length;
    
    // 새 슬라이드 활성화
    filteredSlides[currentSlide].classList.add('active');
    
    // 페이지네이션 업데이트
    updatePagination();
    
    console.log(`다음 슬라이드로 이동: ${currentSlide}`);
}

/**
 * 현재 필터에 맞는 슬라이드 배열 반환
 */
function getFilteredSlides() {
    return currentFilter === 'all' 
        ? document.querySelectorAll('.project-slide')
        : document.querySelectorAll(`.project-slide.${currentFilter}`);
}

/**
 * 페이지네이션 도트 업데이트
 */
function updatePagination() {
    const paginationContainer = document.querySelector('.slider-pagination');
    if (!paginationContainer) return;
    
    // 기존 도트 제거
    paginationContainer.innerHTML = '';
    
    // 필터링된 슬라이드 가져오기
    const filteredSlides = getFilteredSlides();
    if (filteredSlides.length <= 1) return; // 슬라이드가 1개 이하면 페이지네이션 불필요
    
    // 페이지네이션 도트 생성
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < filteredSlides.length; i++) {
        const dot = document.createElement('div');
        dot.className = `pagination-dot${i === currentSlide ? ' active' : ''}`;
        dot.dataset.index = i;
        fragment.appendChild(dot);
    }
    
    paginationContainer.appendChild(fragment);
}

/**
 * 이벤트 위임을 사용한 페이지네이션 클릭 핸들러
 */
function initPaginationEvents() {
    const paginationContainer = document.querySelector('.slider-pagination');
    if (!paginationContainer) return;
    
    // 컨테이너에 한 번만 이벤트 리스너 추가 (이벤트 위임)
    paginationContainer.addEventListener('click', (e) => {
        const dot = e.target.closest('.pagination-dot');
        if (!dot) return; // 도트가 아닌 요소 클릭 시 무시
        
        const index = parseInt(dot.dataset.index);
        if (isNaN(index)) return; // 유효한 인덱스가 아니면 무시
        
        const filteredSlides = getFilteredSlides();
        if (index >= filteredSlides.length) return;
        
        // 현재 슬라이드 비활성화
        filteredSlides[currentSlide].classList.remove('active');
        
        // 선택한 슬라이드로 변경
        currentSlide = index;
        
        // 새 슬라이드 활성화
        filteredSlides[currentSlide].classList.add('active');
        
        // 페이지네이션 업데이트
        updatePagination();
    });
}