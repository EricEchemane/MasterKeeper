const fillSliderTracks = () => {
    const sliders = document.querySelectorAll('input[type="range"]');

    const rangeToPercent = (slider: any) => {
        const max = slider.getAttribute("max");
        const percent: any = (slider.value / max) * 100;

        return `${parseInt(percent)}%`;
    };

    sliders.forEach((slider: any) => {
        slider.style.setProperty("--track-fill", rangeToPercent(slider));

        slider.addEventListener("input", (e: any) => {
            e.target.style.setProperty("--track-fill", rangeToPercent(e.target));
        });
    });
};

export default fillSliderTracks;