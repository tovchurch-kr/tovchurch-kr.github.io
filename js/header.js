/**
 * TOV 종합건축 - 헤더 및 네비게이션 JavaScript
 */

// DOM 요소 선택
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');
const header = document.querySelector('header');

// 모바일 네비게이션 토글
function initMobileNav() {
    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        
        // 햄버거 메뉴 애니메이션
        burger.classList.toggle('toggle');
        
        // 네비게이션 링크 애니메이션
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });
}

// 스크롤 시 헤더 스타일 변경
function initHeaderScroll() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// 스무스 스크롤 (네비게이션 링크)
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // 모든 네비게이션 링크에서 active 클래스 제거
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            
            // 클릭된 링크에 active 클래스 추가
            this.classList.add('active');
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // 모바일 메뉴 닫기
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                burger.classList.remove('toggle');
                
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });
}

// 스크롤 위치에 따른 메뉴 활성화 추가
function initScrollSpy() {
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        
        // 각 섹션 확인하여 해당 메뉴 활성화
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// 초기화 함수
function initHeader() {
    initMobileNav();
    initHeaderScroll();
    initSmoothScroll();
    initScrollSpy();
}

// DOM이 로드되면 초기화
document.addEventListener('DOMContentLoaded', initHeader);