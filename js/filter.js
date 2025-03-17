/**
 * TOV 종합건축 - 프로젝트 필터 JavaScript
 */

// DOM 요소 선택
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

// 프로젝트 필터 초기화
function initProjectFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 활성화된 버튼 스타일 변경
            filterBtns.forEach(btn => btn.classList.remove('active'));
            btn.classList.add('active');
            
            // 선택된 필터 값
            const filterValue = btn.getAttribute('data-filter');
            
            // 프로젝트 필터링
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// 초기화 함수
function initFilter() {
    if (filterBtns.length && projectItems.length) {
        initProjectFilters();
    }
}

// DOM이 로드되면 초기화
document.addEventListener('DOMContentLoaded', initFilter);