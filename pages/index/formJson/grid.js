export default colWidgets => {
  return {
    type: 'm-grid',
    category: 'container',
    icon: 'grid',
    cols: colWidgets,
    options: {
      name: 'mgrid50000',
      hidden: false,
      gutter: 12,
      colHeight: null,
      customClass: '',
    },
    id: 'mgrid50000',
  }
}
