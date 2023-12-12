export const colors = {
  white: '#f5f5f5',
  mainFontColour: '#5a5a5a',
  grayBtn: '#757575',
  secondaryFontColour: '#313131',
  textColour: '#333',
  smallFontColour: '#rgba(51, 51, 51, 0.5)',
  yellow: 'rgba(255, 244, 141, 0.4)',
  brown: 'rgba(255, 132, 63, 0.4)',
  green: 'rgba(161, 193, 156, 0.4)',
  purple: 'rgba(153, 151, 224, 0.4)'
};

export const fonts = {
  header: 'Raleway',
  secondary: 'RalewayReg',
  text: 'Montserrat',
  boldText: 'MontserratBold'
}

export const textStyles = {
  H1: {
    color: colors.mainFontColour,
    fontFamily: fonts.header,
    fontSize: 20,
    marginTop: 20,
    paddingBottom: 50
  },
  H1Upper: {
    color: colors.mainFontColour,
    fontFamily: fonts.header,
    fontSize: 20,
    textTransform: 'uppercase'
  },
  button: {
    fontFamily: fonts.header,
    color: colors.mainFontColour
  },
  pageTitle: {
    color: colors.mainFontColour,
    fontFamily: fonts.header,
    fontSize: 28,
    textTransform: 'uppercase'
  },
  spacingHelp: {
    marginTop: 100,
    marginBottom: 25,
    marginLeft: 20
  }
};

export const padding = {
  none: {
    padding: 0,
    paddingHorizontal: 0,
    paddingVertical: 0
  }
}

export const modalStyle = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000005b'
  },
  view: {
    margin: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  text: {
    fontFamily: fonts.text,
    fontSize: 16
  },
  linkText: {
    fontSize: 16,
    fontFamily: fonts.header
  }
}