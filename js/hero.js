/**
 * TOV 종합건축 - 히어로 섹션 JavaScript
 */

// 히어로 섹션 패럴랙스 효과
function initHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        // 모바일에서는 패럴랙스 효과 적용 안함
        if (window.innerWidth <= 768) return;
        
        const scrollPosition = window.scrollY;
        if (scrollPosition <= window.innerHeight) {
            // 스크롤 위치에 따라 배경 이미지 위치 조정
            const yPos = scrollPosition * 0.3;
            hero.style.backgroundPosition = `center -${yPos}px`;
        }
    });
}

// 스크롤 인디케이터 클릭 이벤트
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;
    
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            window.scrollTo({
                top: aboutSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
}

// 초기화 함수
function initHeroSection() {
    initHeroParallax();
    initScrollIndicator();
}

// DOM이 로드되면 초기화
document.addEventListener('DOMContentLoaded', initHeroSection);