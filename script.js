document.body.style.overflow = 'hidden';
const buttonActions = {


    1: ['platform1', 'platform3'],
    2: ['platform3', 'platform4'],
    3: ['platform1'],
    4: ['platform3'],
    5: ['platform2'],
    6: ['platform2', 'platform3'],
    7: ['platform2', 'platform4'],
    8: ['platform2', 'platform3'],
    9: ['platform3'],
    10: ['platform1', 'platform2'],
    11: ['platform1'],
    12: ['platform1', 'platform3']
};

const leftButtons = [1, 2, 3, 4, 5, 6];
const rightButtons = [7, 8, 9, 10, 11, 12];
const maxActiveButtons = 3; // Максимум активных кнопок

document.querySelectorAll('.switch').forEach((button, index) => {
    button.addEventListener('click', () => {
        const isActive = button.classList.toggle('active');
        if (isActive && getActiveButtonCount() > maxActiveButtons) {
            button.classList.remove('active');
        } else {
            handleButtonPress(index + 1);
            updatePlatformStates();
        }
    });
});

function getActiveButtonCount() {
    return document.querySelectorAll('.switch.active').length;
}

function handleButtonPress(buttonIndex) {
    const platforms = buttonActions[buttonIndex];
    if (platforms) {
        platforms.forEach(platformId => {
            const platform = document.querySelector(`#${platformId}`);
            if (document.querySelector(`#btn${buttonIndex}`).classList.contains('active')) {
                if (platform.dataset.state !== 'fixed') {
                    platform.classList.add('ghost');
                    platform.dataset.state = 'ghost';
                }
            } else {
                // При деактивации кнопки
                if (platform.dataset.state === 'ghost' && !isPlatformSupported(platformId)) {
                    platform.classList.remove('ghost');
                    platform.dataset.state = 'invisible';
                }
            }
        });
    }
}

function updatePlatformStates() {
    const allPlatforms = ['platform1', 'platform2', 'platform3', 'platform4'];

    // Обновляем состояние фиксированных платформ
    allPlatforms.forEach(platformId => {
        const platform = document.querySelector(`#${platformId}`);
        if (platform.dataset.state === 'fixed' && !isPlatformSupportedByBothSides(platformId)) {
            platform.classList.remove('fixed');
            platform.classList.add('ghost');
            platform.dataset.state = 'ghost';
        }
    });

    // Обновляем состояние призрачных платформ
    allPlatforms.forEach(platformId => {
        const platform = document.querySelector(`#${platformId}`);
        const isGhost = platform.dataset.state === 'ghost';

        const affectedByLeft = leftButtons.some(buttonIndex => 
            buttonActions[buttonIndex].includes(platformId) && document.querySelector(`#btn${buttonIndex}`).classList.contains('active')
        );

        const affectedByRight = rightButtons.some(buttonIndex =>
            buttonActions[buttonIndex].includes(platformId) && document.querySelector(`#btn${buttonIndex}`).classList.contains('active')
        );

        if (affectedByLeft && affectedByRight) {
            if (isGhost && platform.dataset.state !== 'fixed') {
                platform.classList.remove('ghost');
                platform.classList.add('fixed');
                platform.dataset.state = 'fixed';
            }
        } else if (platform.dataset.state === 'ghost' && !isPlatformSupported(platformId)) {
            if (!isPlatformSupported(platformId)) {
                platform.classList.remove('ghost');
                platform.dataset.state = 'invisible';
            }
        }
    });
}

function isPlatformSupportedByBothSides(platformId) {
    const isSupportedByLeft = leftButtons.some(buttonIndex =>
        buttonActions[buttonIndex].includes(platformId) &&
        document.querySelector(`#btn${buttonIndex}`).classList.contains('active')
    );

    const isSupportedByRight = rightButtons.some(buttonIndex =>
        buttonActions[buttonIndex].includes(platformId) &&
        document.querySelector(`#btn${buttonIndex}`).classList.contains('active')
    );

    return isSupportedByLeft && isSupportedByRight;
}

function isPlatformSupported(platformId) {
    const isSupportedByLeft = leftButtons.some(buttonIndex =>
        buttonActions[buttonIndex].includes(platformId) &&
        document.querySelector(`#btn${buttonIndex}`).classList.contains('active')
    );

    const isSupportedByRight = rightButtons.some(buttonIndex =>
        buttonActions[buttonIndex].includes(platformId) &&
        document.querySelector(`#btn${buttonIndex}`).classList.contains('active')
    );

    return isSupportedByLeft || isSupportedByRight;
}
