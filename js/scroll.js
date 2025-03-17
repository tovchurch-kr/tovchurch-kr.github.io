/**
 * TOV 종합건축 - 스크롤 애니메이션 관련 JavaScript
 */

// DOM 요소 선택
const fadeElements = document.querySelectorAll('.fade-in');
const goTopBtn = document.querySelector('.go-top-fixed');

// 스크롤 애니메이션 초기화
function initScrollAnimations() {
    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', () => {
        // 각 fade-in 요소 확인하여 애니메이션 적용
        fadeElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
        
        // Go-top 버튼 표시/숨김
        if (window.scrollY > 300) {
            goTopBtn.classList.add('visible');
        } else {
            goTopBtn.classList.remove('visible');
        }
    });
}

// 페이지 로드 애니메이션
function initLoadAnimations() {
    window.addEventListener('load', () => {
        // 초기 애니메이션 요소 표시
        fadeElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    });
}

// go-top 버튼 초기화
function initGoTopButton() {
    // go-top 버튼 클릭 이벤트
    goTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 초기화 함수
function initScroll() {
    initScrollAnimations();
    initLoadAnimations();
    initGoTopButton();
}

// DOM이 로드되면 초기화
document.addEventListener('DOMContentLoaded', initScroll);