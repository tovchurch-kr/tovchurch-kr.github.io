/**
 * TOV 종합건축 - 스크롤 애니메이션 관련 JavaScript (최적화 버전)
 */

// DOM 요소 선택
const fadeElements = document.querySelectorAll('.fade-in');
const goTopBtn = document.querySelector('.go-top-fixed');

// 스크롤 이벤트 Throttle 함수
function throttle(callback, delay = 100) {
    let isThrottled = false;
    
    return function(...args) {
        if (isThrottled) return;
        
        isThrottled = true;
        callback.apply(this, args);
        
        setTimeout(() => {
            isThrottled = false;
        }, delay);
    };
}

// 요소가 뷰포트 내에 있는지 확인하는 함수
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) - 100 &&
        rect.bottom >= 0
    );
}

// IntersectionObserver를 사용한 페이드인 요소 감지
function initIntersectionObserver() {
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // 한번 나타난 요소는 더 이상 관찰할 필요 없음
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // 각 페이드인 요소 관찰 시작
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // IntersectionObserver를 지원하지 않는 브라우저에서의 대체 코드
        // 스크롤 이벤트를 throttle 처리하여 성능 최적화
        window.addEventListener('scroll', throttle(() => {
            fadeElements.forEach(element => {
                if (isElementInViewport(element)) {
                    element.classList.add('visible');
                }
            });
        }, 200));
    }
}

// 스크롤 애니메이션 초기화 (최적화)
function initScrollAnimations() {
    // IntersectionObserver 사용
    initIntersectionObserver();
    
    // Go-top 버튼 표시/숨김 (throttle 처리)
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 300) {
            goTopBtn.classList.add('visible');
        } else {
            goTopBtn.classList.remove('visible');
        }
    }, 100));
}

// 페이지 로드 애니메이션 (최적화)
function initLoadAnimations() {
    window.addEventListener('load', () => {
        // 초기 애니메이션 요소 표시 (지연 처리하여 초기 로딩 성능 향상)
        setTimeout(() => {
            fadeElements.forEach(element => {
                if (isElementInViewport(element)) {
                    element.classList.add('visible');
                }
            });
        }, 100);
    });
}

// go-top 버튼 초기화
function initGoTopButton() {
    // go-top 버튼 클릭 이벤트
    if (goTopBtn) {
        goTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// 초기화 함수
function initScroll() {
    initScrollAnimations();
    initLoadAnimations();
    initGoTopButton();
}

// DOM이 로드되면 초기화
document.addEventListener('DOMContentLoaded', initScroll);