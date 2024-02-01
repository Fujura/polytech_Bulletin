import styles from '/src/styles/Profile.module.css';


export  const onShowLeftBar = (setShowLeftBar: any, showLeftBar: boolean) => {
    setShowLeftBar(!showLeftBar);
    const burgerContainer = document.querySelector(
      `.${styles.burgerContainer}`
    );

    if (burgerContainer) {
      burgerContainer.classList.toggle("burger__Active");
    }
  };