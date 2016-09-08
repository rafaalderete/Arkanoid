--
-- Base de datos: `test`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `games_data`
--

CREATE TABLE IF NOT EXISTS `games_data` (
  `id` varchar(50) NOT NULL,
  `data` varchar(15000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MEMORY DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `games_online`
--

CREATE TABLE IF NOT EXISTS `games_online` (
  `id_game` int(11) NOT NULL AUTO_INCREMENT,
  `id_player1` bigint(50) NOT NULL,
  `id_player2` bigint(50) DEFAULT NULL,
  `level` int(11) NOT NULL,
  `matched` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_game`)
) ENGINE=MEMORY  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `google_users`
--

CREATE TABLE IF NOT EXISTS `google_users` (
  `id_user` bigint(50) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1000000 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `scores_multi`
--

CREATE TABLE IF NOT EXISTS `scores_multi` (
  `id_user` bigint(50) NOT NULL,
  `win` int(11) NOT NULL,
  `lose` int(11) NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `scores_single`
--

CREATE TABLE IF NOT EXISTS `scores_single` (
  `id_score` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` bigint(50) NOT NULL,
  `score` int(11) NOT NULL,
  PRIMARY KEY (`id_score`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `password` text NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
