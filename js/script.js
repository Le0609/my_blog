document.addEventListener('DOMContentLoaded', function() {
    // 添加页面加载淡入效果
    document.body.classList.add('loaded');
    
    // 创建页面过渡元素
    if (!document.querySelector('.page-transition')) {
        const pageTransition = document.createElement('div');
        pageTransition.className = 'page-transition';
        document.body.appendChild(pageTransition);
    }
    
    // 响应式导航菜单
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // 创建移动端导航菜单
            if (!document.querySelector('.mobile-nav')) {
                const mobileNav = document.createElement('div');
                mobileNav.className = 'mobile-nav';
                
                // 复制导航链接
                const navLinksClone = navLinks.cloneNode(true);
                mobileNav.appendChild(navLinksClone);
                
                // 添加到DOM
                document.body.appendChild(mobileNav);
                
                // 添加样式
                document.head.insertAdjacentHTML('beforeend', `
                    <style>
                        .mobile-nav {
                            position: fixed;
                            top: 4.8rem;
                            left: 0;
                            width: 100%;
                            height: 0;
                            background-color: rgba(255, 255, 255, 0.98);
                            backdrop-filter: blur(20px);
                            -webkit-backdrop-filter: blur(20px);
                            overflow: hidden;
                            transition: all 0.5s cubic-bezier(0.28, 0.11, 0.32, 1);
                            z-index: 99;
                        }
                        
                        .mobile-nav.active {
                            height: calc(100vh - 4.8rem);
                            border-top: 1px solid rgba(0, 0, 0, 0.05);
                        }
                        
                        .mobile-nav .nav-links {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100%;
                            gap: 3.2rem;
                            opacity: 0;
                            transition: opacity 0.5s ease 0.2s;
                        }
                        
                        .mobile-nav.active .nav-links {
                            opacity: 1;
                        }
                        
                        .mobile-nav .nav-links a {
                            font-size: 2.4rem;
                            opacity: 0;
                            transform: translateY(20px);
                            transition: opacity 0.5s ease, transform 0.5s ease;
                        }
                        
                        .mobile-nav.active .nav-links a {
                            opacity: 1;
                            transform: translateY(0);
                        }
                        
                        .mobile-nav .nav-links a:nth-child(1) { transition-delay: 0.1s; }
                        .mobile-nav .nav-links a:nth-child(2) { transition-delay: 0.2s; }
                        .mobile-nav .nav-links a:nth-child(3) { transition-delay: 0.3s; }
                        .mobile-nav .nav-links a:nth-child(4) { transition-delay: 0.4s; }
                        
                        .menu-toggle.active span:nth-child(1) {
                            transform: translateY(8px) rotate(45deg);
                        }
                        
                        .menu-toggle.active span:nth-child(2) {
                            opacity: 0;
                        }
                        
                        .menu-toggle.active span:nth-child(3) {
                            transform: translateY(-8px) rotate(-45deg);
                        }
                        
                        /* 页面加载过渡效果 */
                        body {
                            opacity: 0;
                            transition: opacity 0.8s ease;
                        }
                        
                        body.loaded {
                            opacity: 1;
                        }
                    </style>
                `);
            }
            
            // 切换移动导航的显示状态
            const mobileNav = document.querySelector('.mobile-nav');
            if (mobileNav) {
                mobileNav.classList.toggle('active');
            }
        });
    }
    
    // 页面过渡效果
    document.querySelectorAll('a').forEach(link => {
        // 排除锚点链接和外部链接
        if (link.getAttribute('href') && 
            !link.getAttribute('href').startsWith('#') && 
            !link.getAttribute('href').startsWith('http') &&
            !link.getAttribute('target')) {
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href');
                
                // 激活过渡动画
                const pageTransition = document.querySelector('.page-transition');
                if (pageTransition) {
                    pageTransition.classList.add('active');
                    
                    // 短暂延迟后导航到新页面
                    setTimeout(() => {
                        window.location.href = target;
                    }, 500);
                } else {
                    window.location.href = target;
                }
            });
        }
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 如果移动导航是打开的，关闭它
                const mobileNav = document.querySelector('.mobile-nav');
                const menuToggleBtn = document.querySelector('.menu-toggle');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    if (menuToggleBtn) {
                        menuToggleBtn.classList.remove('active');
                    }
                }
            }
        });
    });
    
    // 滚动时导航栏效果
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('header');
        
        if (header) {
            // 导航栏隐藏/显示
            if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
                // 向下滚动
                header.style.transform = 'translateY(-100%)';
            } else {
                // 向上滚动
                header.style.transform = 'translateY(0)';
            }
            
            // 滚动时改变导航栏样式
            if (currentScrollTop > 20) {    
                header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
            
            lastScrollTop = currentScrollTop;
        }
        
        // 检测元素进入视图
        checkElementsInView();
    }, { passive: true });
    
    // 检测元素是否在视图中并添加动画
    function checkElementsInView() {
        // 找到所有需要淡入的元素
        const elements = document.querySelectorAll('.post-card, .newsletter h2, .newsletter p, .newsletter-form, .about-content, .contact-grid, h1, .hero p, .featured-posts h2');
        
        elements.forEach(element => {
            // 为元素添加fade-in类（如果还没有）
            if (!element.classList.contains('fade-in') && !element.classList.contains('visible')) {
                element.classList.add('fade-in');
            }
            
            // 检查元素是否在视图中
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            if (rect.top <= windowHeight * 0.85) {
                element.classList.add('visible');
            }
        });
    }
    
    // 初始检测元素
    setTimeout(checkElementsInView, 100);
    
    // 表单提交处理
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // 显示成功消息
                const successMessage = document.createElement('p');
                successMessage.textContent = '感谢订阅！';
                successMessage.style.color = '#0071e3';
                successMessage.style.fontWeight = '500';
                successMessage.style.margin = '2rem 0 0';
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(10px)';
                successMessage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                // 检查是否已经有成功消息
                const existingMessage = this.querySelector('p');
                if (existingMessage) {
                    existingMessage.remove();
                }
                
                this.appendChild(successMessage);
                
                // 触发动画
                setTimeout(() => {
                    successMessage.style.opacity = '1';
                    successMessage.style.transform = 'translateY(0)';
                }, 10);
                
                emailInput.value = '';
                
                // 3秒后淡出成功消息
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    successMessage.style.transform = 'translateY(-10px)';
                    
                    // 完全移除元素
                    setTimeout(() => {
                        successMessage.remove();
                    }, 500);
                }, 3000);
            }
        });
    }
    
    // 联系表单处理
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单中的所有输入
            const nameInput = this.querySelector('#name');
            const emailInput = this.querySelector('#email');
            const messageInput = this.querySelector('#message');
            
            // 简单验证
            if (nameInput.value && emailInput.value && messageInput.value) {
                // 创建漂亮的成功提示
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div class="success-icon">✓</div>
                    <h3>感谢您的留言！</h3>
                    <p>我们会尽快回复您。</p>
                `;
                
                // 添加样式
                document.head.insertAdjacentHTML('beforeend', `
                    <style>
                        .success-message {
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background-color: white;
                            padding: 4rem;
                            border-radius: 2rem;
                            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                            text-align: center;
                            z-index: 1000;
                            opacity: 0;
                            transition: opacity 0.5s ease;
                        }
                        
                        .success-message.active {
                            opacity: 1;
                        }
                        
                        .success-icon {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 6rem;
                            height: 6rem;
                            background-color: #5bd75b;
                            color: white;
                            font-size: 3rem;
                            border-radius: 50%;
                            margin: 0 auto 2rem;
                        }
                        
                        .success-message h3 {
                            font-size: 2.4rem;
                            margin-bottom: 1rem;
                        }
                        
                        .success-message p {
                            color: var(--secondary-color);
                        }
                    </style>
                `);
                
                // 添加到DOM
                document.body.appendChild(successMessage);
                
                // 显示消息
                setTimeout(() => {
                    successMessage.classList.add('active');
                }, 10);
                
                // 重置表单
                this.reset();
                
                // 3秒后移除消息
                setTimeout(() => {
                    successMessage.classList.remove('active');
                    
                    // 淡出后完全移除
                    setTimeout(() => {
                        successMessage.remove();
                    }, 500);
                }, 3000);
            }
        });
    }
    
    // 图片懒加载
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    
                    // 添加淡入效果
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease';
                    
                    // 图片加载后淡入
                    img.onload = function() {
                        img.style.opacity = '1';
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});