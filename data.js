/* GYMBRO — biblioteca de ejercicios
 *
 * id:  identificador único (también nombre de las imágenes en img/ex/)
 * n:   nombre
 * m:   grupo muscular principal (ver GB_MUSCLES)
 * p:   dónde se puede hacer: 'casa', 'gym'
 * q:   material necesario en casa: 'mancuernas', 'banco', 'banda', 'barra' (de dominadas), 'rueda', 'cuerda'
 *      (vacío = solo peso corporal, suelo, silla o mesa)
 * e:   equipo (texto)
 * u:   unidad de la segunda columna: 'reps' (por defecto), 'seg' o 'min'
 * mu:  músculos que trabaja
 * d:   resumen
 * s:   pasos para hacerlo
 * t:   consejos / errores comunes
 * img: true si tiene animación (img/ex/<id>.webp) y miniatura (img/ex/<id>-t.webp)
 *
 * Animaciones 3D: Open Exercise Figures (https://github.com/AbanoubAmir/open-exercise-figures), dominio público (CC0).
 * Músculos trabajados por ejercicio: muscles.js
 */
window.GB_MUSCLES = [
  { id: 'pecho', n: 'Pecho' },
  { id: 'espalda', n: 'Espalda' },
  { id: 'hombros', n: 'Hombros' },
  { id: 'biceps', n: 'Bíceps' },
  { id: 'triceps', n: 'Tríceps' },
  { id: 'piernas', n: 'Piernas' },
  { id: 'gluteos', n: 'Glúteos' },
  { id: 'core', n: 'Core' },
  { id: 'cardio', n: 'Cardio' }
];

window.GB_EQUIPMENT = [
  { id: 'mancuernas', n: 'Mancuernas' },
  { id: 'banco', n: 'Banco' },
  { id: 'banda', n: 'Bandas elásticas' },
  { id: 'barra', n: 'Barra de dominadas' }
];

window.GB_EXERCISES = [
  /* ============ PECHO ============ */
  {
    id: 'press-banca', n: 'Press de banca con barra', m: 'pecho', p: ['gym'], e: 'Barra y banco plano', img: true,
    mu: 'Pectoral, tríceps y deltoides anterior',
    d: 'El ejercicio rey para el pecho y la fuerza del tren superior.',
    s: ['Túmbate con los ojos bajo la barra, pies firmes en el suelo y escápulas juntas y hacia abajo.',
        'Agarra la barra algo más abierto que los hombros y sácala del soporte con los brazos estirados.',
        'Baja controlando hasta rozar la parte media del pecho, con los codos a unos 45° del cuerpo.',
        'Empuja con fuerza hasta estirar los brazos sin perder la posición de la espalda.'],
    t: ['No rebotes la barra en el pecho.', 'Usa un compañero o topes de seguridad con cargas pesadas.']
  },
  {
    id: 'press-inclinado-mancuernas', n: 'Press inclinado con mancuernas', m: 'pecho', p: ['gym', 'casa'], q: ['mancuernas', 'banco'], e: 'Mancuernas y banco inclinado', img: true,
    mu: 'Pectoral superior, deltoides anterior y tríceps',
    d: 'Enfatiza la parte alta del pecho con gran rango de movimiento.',
    s: ['Ajusta el banco a 30–45° y siéntate con una mancuerna sobre cada muslo.',
        'Recuéstate llevando las mancuernas a la altura del pecho, palmas hacia delante.',
        'Empuja hacia arriba juntando ligeramente las mancuernas sin chocarlas.',
        'Baja despacio hasta sentir un buen estiramiento en el pecho.'],
    t: ['Un banco demasiado inclinado pasa el trabajo a los hombros.', 'Mantén las muñecas rectas sobre los codos.']
  },
  {
    id: 'press-mancuernas', n: 'Press plano con mancuernas', m: 'pecho', p: ['gym', 'casa'], q: ['mancuernas', 'banco'], e: 'Mancuernas y banco', img: true,
    mu: 'Pectoral, tríceps y deltoides anterior',
    d: 'Más rango y trabajo de estabilidad que el press con barra.',
    s: ['Túmbate en el banco con una mancuerna en cada mano a la altura del pecho.',
        'Junta las escápulas y apoya bien los pies.',
        'Empuja las mancuernas hacia arriba hasta estirar los brazos.',
        'Baja controlando hasta que los codos queden un poco por debajo del banco.'],
    t: ['Codos a 45°, no abiertos en cruz.', 'Controla la bajada: 2–3 segundos.']
  },
  {
    id: 'aperturas', n: 'Aperturas con mancuernas', m: 'pecho', p: ['gym', 'casa'], q: ['mancuernas', 'banco'], e: 'Mancuernas y banco', img: true,
    mu: 'Pectoral (aislamiento)',
    d: 'Aísla el pecho trabajando el estiramiento.',
    s: ['Túmbate con las mancuernas arriba, palmas enfrentadas y codos ligeramente flexionados.',
        'Abre los brazos en arco hacia los lados manteniendo la flexión del codo.',
        'Baja hasta sentir el estiramiento del pecho, sin pasar de la línea de los hombros.',
        'Vuelve por el mismo arco como si abrazaras un árbol.'],
    t: ['Usa un peso moderado: es un ejercicio de aislamiento.', 'No estires del todo los codos.']
  },
  {
    id: 'cruce-poleas', n: 'Cruce de poleas', m: 'pecho', p: ['gym'], e: 'Poleas altas', img: true,
    mu: 'Pectoral (zona media e inferior)',
    d: 'Tensión constante en el pecho durante todo el recorrido.',
    s: ['Coloca las poleas en posición alta y agarra un estribo con cada mano.',
        'Da un paso al frente, inclina el torso ligeramente y flexiona un poco los codos.',
        'Lleva las manos hacia abajo y al centro hasta que se junten frente a tu cadera.',
        'Aprieta el pecho un segundo y vuelve despacio.'],
    t: ['El movimiento sale del hombro, no de doblar los codos.']
  },
  {
    id: 'press-maquina-pecho', n: 'Press de pecho en máquina', m: 'pecho', p: ['gym'], e: 'Máquina de press', img: true,
    mu: 'Pectoral, tríceps y deltoides anterior',
    d: 'Ideal para principiantes o para llegar al fallo con seguridad.',
    s: ['Ajusta el asiento para que los agarres queden a la altura del pecho medio.',
        'Apoya la espalda y junta las escápulas.',
        'Empuja hasta casi estirar los brazos.',
        'Vuelve despacio hasta sentir el estiramiento en el pecho.'],
    t: ['No despegues la espalda del respaldo.']
  },
  {
    id: 'fondos-paralelas', n: 'Fondos en paralelas', m: 'pecho', p: ['gym'], e: 'Paralelas', img: true,
    mu: 'Pectoral inferior, tríceps y hombros',
    d: 'Ejercicio de peso corporal muy completo para el empuje.',
    s: ['Sujétate en las paralelas con los brazos estirados.',
        'Inclina el torso hacia delante y flexiona un poco las rodillas.',
        'Baja doblando los codos hasta formar unos 90°.',
        'Empuja hasta volver arriba sin bloquear de golpe.'],
    t: ['Si te duelen los hombros, reduce la profundidad.', 'Añade peso con un cinturón cuando hagas más de 12.']
  },
  {
    id: 'flexiones', n: 'Flexiones', m: 'pecho', p: ['casa', 'gym'], q: [], e: 'Peso corporal', img: true,
    mu: 'Pectoral, tríceps, hombros y core',
    d: 'El básico de casa para pecho y brazos.',
    s: ['Apoya las manos algo más abiertas que los hombros y las puntas de los pies.',
        'Forma una línea recta de la cabeza a los talones apretando abdomen y glúteos.',
        'Baja el pecho hasta casi tocar el suelo con los codos a 45°.',
        'Empuja el suelo hasta estirar los brazos.'],
    t: ['No dejes caer la cadera.', 'Si no llegas a 8, empieza con flexiones inclinadas.']
  },
  {
    id: 'flexiones-inclinadas', n: 'Flexiones inclinadas', m: 'pecho', p: ['casa', 'gym'], q: [], e: 'Silla, mesa o banco', img: true,
    mu: 'Pectoral, tríceps y hombros',
    d: 'Versión más fácil: perfecta para empezar.',
    s: ['Apoya las manos en una superficie firme y elevada (mesa, banco o encimera).',
        'Camina los pies hacia atrás hasta que el cuerpo quede recto.',
        'Baja el pecho hacia el borde doblando los codos.',
        'Empuja para volver a la posición inicial.'],
    t: ['Cuanto más alta la superficie, más fácil. Bájala a medida que progreses.']
  },
  {
    id: 'flexiones-declinadas', n: 'Flexiones con pies elevados', m: 'pecho', p: ['casa', 'gym'], q: [], e: 'Silla, sofá o banco', img: true,
    mu: 'Pectoral superior, hombros y tríceps',
    d: 'Versión más difícil que carga más el pecho alto y los hombros.',
    s: ['Apoya los pies sobre una silla o banco y las manos en el suelo.',
        'Mantén el cuerpo recto y el abdomen firme.',
        'Baja la cabeza y el pecho hacia el suelo de forma controlada.',
        'Empuja hasta estirar los brazos.'],
    t: ['No arquees la zona lumbar.']
  },

  /* ============ ESPALDA ============ */
  {
    id: 'dominadas', n: 'Dominadas', m: 'espalda', p: ['gym', 'casa'], q: ['barra'], e: 'Barra de dominadas', img: true,
    mu: 'Dorsal ancho, bíceps y espalda media',
    d: 'El mejor ejercicio de peso corporal para una espalda ancha.',
    s: ['Cuélgate de la barra con agarre prono (palmas al frente) algo más abierto que los hombros.',
        'Baja los hombros alejándolos de las orejas y aprieta el abdomen.',
        'Tira con los codos hacia abajo hasta pasar la barbilla por encima de la barra.',
        'Baja controlando hasta estirar los brazos por completo.'],
    t: ['Si aún no puedes, usa una banda elástica de ayuda o haz solo la bajada lenta.', 'Evita balancearte.']
  },
  {
    id: 'dominadas-supinas', n: 'Dominadas supinas (chin-up)', m: 'espalda', p: ['gym', 'casa'], q: ['barra'], e: 'Barra de dominadas', img: true,
    mu: 'Dorsal ancho y bíceps',
    d: 'Con las palmas hacia ti: algo más fácil y con más bíceps.',
    s: ['Cuélgate con las palmas mirando hacia ti, a la anchura de los hombros.',
        'Activa la espalda bajando los hombros.',
        'Sube hasta que la barbilla supere la barra.',
        'Baja lento hasta estirar los brazos.'],
    t: ['Piensa en llevar el pecho hacia la barra.']
  },
  {
    id: 'jalon-pecho', n: 'Jalón al pecho', m: 'espalda', p: ['gym'], e: 'Polea alta', img: true,
    mu: 'Dorsal ancho, redondo mayor y bíceps',
    d: 'Alternativa a las dominadas con la carga que necesites.',
    s: ['Siéntate y ajusta el soporte para que sujete bien tus muslos.',
        'Agarra la barra ancha con las palmas al frente.',
        'Saca el pecho y tira de la barra hacia la parte alta del pecho llevando los codos abajo.',
        'Sube controlando hasta estirar los brazos.'],
    t: ['No tires con el cuello ni detrás de la nuca.', 'No te eches demasiado hacia atrás.']
  },
  {
    id: 'remo-barra', n: 'Remo con barra', m: 'espalda', p: ['gym'], e: 'Barra', img: true,
    mu: 'Dorsal, romboides, trapecio y bíceps',
    d: 'Constructor de grosor de espalda.',
    s: ['De pie, flexiona un poco las rodillas e inclina el torso hacia delante unos 45° con la espalda recta.',
        'Sujeta la barra con los brazos estirados, agarre a la anchura de los hombros.',
        'Tira de la barra hacia el ombligo juntando las escápulas.',
        'Baja controlando sin redondear la espalda.'],
    t: ['Mantén la espalda neutra todo el tiempo.', 'No uses impulso del torso.']
  },
  {
    id: 'remo-mancuerna', n: 'Remo con mancuerna a una mano', m: 'espalda', p: ['gym', 'casa'], q: ['mancuernas'], e: 'Mancuerna y banco o silla', img: true,
    mu: 'Dorsal, romboides y bíceps',
    d: 'Trabaja cada lado por separado y corrige desequilibrios.',
    s: ['Apoya una rodilla y la mano del mismo lado sobre un banco o silla.',
        'Con la otra mano sujeta la mancuerna, brazo estirado y espalda plana.',
        'Tira de la mancuerna hacia la cadera llevando el codo atrás.',
        'Baja despacio hasta estirar el brazo.'],
    t: ['No gires el torso para subir el peso.']
  },
  {
    id: 'remo-polea-baja', n: 'Remo en polea baja', m: 'espalda', p: ['gym'], e: 'Polea baja con agarre en V', img: true,
    mu: 'Espalda media, dorsal y bíceps',
    d: 'Tensión constante para la espalda media.',
    s: ['Siéntate con los pies en la plataforma y las rodillas un poco flexionadas.',
        'Agarra el triángulo con los brazos estirados y la espalda recta.',
        'Tira hacia el abdomen sacando pecho y juntando las escápulas.',
        'Estira los brazos de nuevo sin redondear la espalda.'],
    t: ['El torso se queda quieto: solo se mueven los brazos.']
  },
  {
    id: 'peso-muerto', n: 'Peso muerto', m: 'espalda', p: ['gym'], e: 'Barra', img: true,
    mu: 'Cadena posterior completa: espalda, glúteos y femorales',
    d: 'Ejercicio de fuerza total del cuerpo.',
    s: ['Colócate con la barra sobre la mitad del pie y los pies a la anchura de la cadera.',
        'Agarra la barra, baja la cadera, saca pecho y deja la espalda recta.',
        'Empuja el suelo con las piernas manteniendo la barra pegada al cuerpo.',
        'Termina de pie apretando glúteos y baja por el mismo camino.'],
    t: ['Nunca redondees la espalda baja.', 'Aprende la técnica con poco peso.']
  },
  {
    id: 'remo-invertido', n: 'Remo invertido', m: 'espalda', p: ['casa', 'gym'], q: [], e: 'Mesa resistente o barra baja', img: true,
    mu: 'Espalda media, dorsal y bíceps',
    d: 'El remo de peso corporal: ideal en casa.',
    s: ['Túmbate bajo una mesa muy firme (o una barra baja) y agárrala por el borde.',
        'Estira el cuerpo en línea recta apoyando los talones.',
        'Tira del pecho hacia la mesa juntando las escápulas.',
        'Baja controlando hasta estirar los brazos.'],
    t: ['Comprueba que la mesa aguanta tu peso.', 'Dobla las rodillas para hacerlo más fácil.']
  },
  {
    id: 'superman', n: 'Superman', m: 'espalda', p: ['casa', 'gym'], q: [], e: 'Peso corporal', img: true,
    mu: 'Lumbares, glúteos y espalda alta',
    d: 'Fortalece la zona lumbar sin material.',
    s: ['Túmbate boca abajo con brazos y piernas estirados.',
        'Eleva a la vez brazos, pecho y piernas unos centímetros del suelo.',
        'Mantén 1–2 segundos apretando glúteos y espalda.',
        'Baja despacio y repite.'],
    t: ['Mira al suelo para no forzar el cuello.']
  },
  {
    id: 'pullover', n: 'Pullover con mancuerna', m: 'espalda', p: ['gym', 'casa'], q: ['mancuernas', 'banco'], e: 'Mancuerna y banco', img: true,
    mu: 'Dorsal ancho y pectoral',
    d: 'Estira y trabaja el dorsal y el pecho a la vez.',
    s: ['Túmbate en el banco sujetando una mancuerna con ambas manos sobre el pecho.',
        'Con los codos un poco flexionados, lleva la mancuerna hacia atrás por encima de la cabeza.',
        'Baja hasta sentir el estiramiento en dorsales y pecho.',
        'Vuelve por el mismo arco a la posición inicial.'],
    t: ['Mantén la cadera baja y el abdomen firme.']
  },

  /* ============ HOMBROS ============ */
  {
    id: 'press-militar', n: 'Press militar con barra', m: 'hombros', p: ['gym'], e: 'Barra', img: true,
    mu: 'Deltoides, tríceps y core',
    d: 'Fuerza y volumen de hombros.',
    s: ['De pie, sujeta la barra a la altura de las clavículas, agarre algo más ancho que los hombros.',
        'Aprieta glúteos y abdomen para no arquear la espalda.',
        'Empuja la barra hacia arriba pasando cerca de la cara hasta estirar los brazos.',
        'Baja controlando hasta las clavículas.'],
    t: ['Mete la cabeza "dentro" al final para que la barra quede sobre tu centro.']
  },
  {
    id: 'press-hombro-mancuernas', n: 'Press de hombro con mancuernas', m: 'hombros', p: ['gym', 'casa'], q: ['mancuernas'], e: 'Mancuernas', img: true,
    mu: 'Deltoides y tríceps',
    d: 'Press de hombros con más libertad para las articulaciones.',
    s: ['Siéntate o ponte de pie con las mancuernas a la altura de las orejas, palmas al frente.',
        'Aprieta el abdomen y mantén la espalda recta.',
        'Empuja hacia arriba hasta casi estirar los brazos.',
        'Baja despacio hasta la altura de las orejas.'],
    t: ['No choques las mancuernas arriba.']
  },
  {
    id: 'press-hombro-banda', n: 'Press de hombro con banda', m: 'hombros', p: ['casa', 'gym'], q: ['banda'], e: 'Banda elástica', img: true,
    mu: 'Deltoides y tríceps',
    d: 'Press de hombros en casa solo con una banda.',
    s: ['Pisa la banda con ambos pies y sujeta los extremos a la altura de los hombros.',
        'Aprieta abdomen y glúteos.',
        'Empuja las manos hacia arriba hasta estirar los brazos.',
        'Baja despacio resistiendo la banda.'],
    t: ['Usa una banda más dura o pisa más corto para aumentar la dificultad.']
  },
  {
    id: 'flexiones-pino', n: 'Flexiones en pino (contra la pared)', m: 'hombros', p: ['casa', 'gym'], q: [], e: 'Pared', img: true,
    mu: 'Deltoides, tríceps y trapecio',
    d: 'Ejercicio avanzado de hombros con peso corporal.',
    s: ['Apoya las manos a un palmo de la pared y sube las piernas hasta quedar boca abajo apoyado en ella.',
        'Con los brazos estirados, aprieta el abdomen.',
        'Baja la cabeza hacia el suelo doblando los codos.',
        'Empuja hasta estirar los brazos.'],
    t: ['Solo si ya dominas el pino. Pon un cojín bajo la cabeza.']
  },
  {
    id: 'elevaciones-laterales', n: 'Elevaciones laterales', m: 'hombros', p: ['gym', 'casa'], q: ['mancuernas'], e: 'Mancuernas o botellas de agua', img: true,
    mu: 'Deltoides lateral',
    d: 'Da anchura a los hombros.',
    s: ['De pie, con una mancuerna en cada mano a los lados del cuerpo.',
        'Con los codos ligeramente flexionados, sube los brazos hacia los lados.',
        'Para cuando lleguen a la altura de los hombros.',
        'Baja despacio sin dejar caer el peso.'],
    t: ['Usa poco peso y no te balancees.', 'Imagina que empujas las paredes con las manos.']
  },
  {
    id: 'elevaciones-laterales-banda', n: 'Elevaciones laterales con banda', m: 'hombros', p: ['casa', 'gym'], q: ['banda'], e: 'Banda elástica', img: true,
    mu: 'Deltoides lateral',
    d: 'Elevaciones laterales en casa sin mancuernas.',
    s: ['Pisa la banda con los pies juntos y sujeta un extremo en cada mano.',
        'Con los codos un poco flexionados, eleva los brazos hacia los lados.',
        'Sube hasta la altura de los hombros.',
        'Baja despacio controlando la banda.'],
    t: ['Mantén los hombros lejos de las orejas.']
  },
  {
    id: 'elevaciones-frontales', n: 'Elevaciones frontales', m: 'hombros', p: ['gym', 'casa'], q: ['mancuernas'], e: 'Mancuernas', img: true,
    mu: 'Deltoides anterior',
    d: 'Trabaja la parte delantera del hombro.',
    s: ['De pie, mancuernas delante de los muslos.',
        'Eleva un brazo (o ambos) al frente con el codo ligeramente flexionado.',
        'Sube hasta la altura de los ojos.',
        'Baja despacio y repite.'],
    t: ['No eches el cuerpo atrás para subir.']
  },
  {
    id: 'pajaros', n: 'Pájaros (deltoide posterior)', m: 'hombros', p: ['gym', 'casa'], q: ['mancuernas'], e: 'Mancuernas', img: true,
    mu: 'Deltoides posterior y espalda alta',
    d: 'Equilibra el hombro y mejora la postura.',
    s: ['Siéntate en el borde del banco o silla e inclina el torso sobre los muslos.',
        'Deja colgar las mancuernas bajo las piernas, palmas enfrentadas.',
        'Abre los brazos hacia los lados con los codos un poco flexionados.',
        'Aprieta arriba un segundo y baja despacio.'],
    t: ['Peso ligero: el deltoide posterior es un músculo pequeño.']
  },
  {
    id: 'separacion-banda', n: 'Aperturas con banda (pull-apart)', m: 'hombros', p: ['casa', 'gym'], q: ['banda'], e: 'Banda elástica', img: true,
    mu: 'Deltoides posterior, romboides y trapecio',
    d: 'Excelente para la postura y la salud del hombro.',
    s: ['De pie, sujeta la banda con los brazos estirados al frente, a la altura del pecho.',
        'Separa las manos llevando la banda hacia el pecho.',
        'Junta las escápulas al final del movimiento.',
        'Vuelve despacio a la posición inicial.'],
    t: ['Mantén los brazos estirados y los hombros bajos.']
  },
  {
    id: 'face-pull', n: 'Face pull', m: 'hombros', p: ['gym'], e: 'Polea con cuerda', img: true,
    mu: 'Deltoides posterior y manguito rotador',
    d: 'Fundamental para unos hombros sanos.',
    s: ['Coloca la polea a la altura de la cara con la cuerda.',
        'Agarra los extremos con las palmas hacia abajo y da un paso atrás.',
        'Tira hacia la cara separando las manos y llevando los codos altos.',
        'Vuelve despacio estirando los brazos.'],
    t: ['Termina con las manos a los lados de las orejas.']
  },

  /* ============ BÍCEPS ============ */
  {
    id: 'curl-barra', n: 'Curl con barra', m: 'biceps', p: ['gym'], e: 'Barra recta o Z', img: true,
    mu: 'Bíceps y antebrazo',
    d: 'El básico para ganar masa en los bíceps.',
    s: ['De pie, sujeta la barra con las palmas hacia delante a la anchura de los hombros.',
        'Pega los codos a los costados.',
        'Sube la barra doblando solo los codos hasta la altura del pecho.',
        'Baja despacio hasta estirar los brazos.'],
    t: ['No balancees el torso.', 'Controla la bajada: ahí también se crece.']
  },
  {
    id: 'curl-mancuernas', n: 'Curl con mancuernas', m: 'biceps', p: ['gym', 'casa'], q: ['mancuernas'], e: 'Mancuernas', img: true,
    mu: 'Bíceps y antebrazo',
    d: 'Curl clásico con giro de muñeca.',
    s: ['De pie, mancuernas a los lados con las palmas hacia el cuerpo.',
        'Sube la mancuerna girando la muñeca hasta que la palma mire hacia ti.',
        'Aprieta el bíceps arriba.',
        'Baja despacio deshaciendo el giro.'],
    t: ['Codos quietos junto al cuerpo.']
  },
  {
    id: 'curl-martillo', n: 'Curl martillo', m: 'biceps', p: ['gym', 'casa'], q: ['mancuernas'], e: 'Mancuernas', img: true,
    mu: 'Braquial, bíceps y antebrazo',
    d: 'Agarre neutro para brazos más gruesos.',
    s: ['De pie, mancuernas a los lados con las palmas enfrentadas.',
        'Sube las mancuernas sin girar la muñeca.',
        'Llega hasta la altura de los hombros.',
        'Baja controlando.'],
    t: ['Mantén las muñecas rectas.']
  },
  {
    id: 'curl-concentrado', n: 'Curl concentrado', m: 'biceps', p: ['gym', 'casa'], q: ['mancuernas'], e: 'Mancuerna y banco o silla', img: true,
    mu: 'Bíceps (aislamiento)',
    d: 'Máximo aislamiento del bíceps.',
    s: ['Siéntate con las piernas abiertas y apoya el codo en la cara interna del muslo.',
        'Con el brazo estirado, sujeta la mancuerna.',
        'Sube la mancuerna hacia el hombro apretando el bíceps.',
        'Baja lentamente.'],
    t: ['No muevas el codo del muslo.']
  },
  {
    id: 'curl-polea', n: 'Curl en polea', m: 'biceps', p: ['gym'], e: 'Polea baja', img: true,
    mu: 'Bíceps',
    d: 'Tensión constante en todo el recorrido.',
    s: ['De pie frente a la polea baja, sujeta la barra con las palmas hacia arriba.',
        'Pega los codos a los costados.',
        'Sube la barra hasta el pecho.',
        'Baja despacio sin soltar la tensión.'],
    t: ['Da un paso atrás para tener tensión desde abajo.']
  },
  {
    id: 'curl-predicador', n: 'Curl predicador', m: 'biceps', p: ['gym'], e: 'Banco Scott', img: true,
    mu: 'Bíceps (porción corta)',
    d: 'Elimina el impulso y aísla el bíceps.',
    s: ['Apoya la parte posterior de los brazos sobre el cojín del banco.',
        'Sujeta la barra con las palmas hacia arriba.',
        'Sube la barra hasta que los antebrazos queden casi verticales.',
        'Baja despacio sin llegar a bloquear el codo.'],
    t: ['No dejes caer el peso abajo: protege el codo.']
  },

  {
    id: 'curl-banda', n: 'Curl con banda elástica', m: 'biceps', p: ['casa', 'gym'], q: ['banda'], e: 'Banda elástica', img: true,
    mu: 'Bíceps y antebrazo',
    d: 'Curl de bíceps en casa solo con una banda.',
    s: ['Pisa la banda con los pies y sujeta los extremos con las palmas hacia delante.',
        'Pega los codos a los costados.',
        'Sube las manos hacia los hombros doblando los codos.',
        'Baja despacio resistiendo la banda.'],
    t: ['Pisa la banda más corta para que cueste más.']
  },

  /* ============ TRÍCEPS ============ */
  {
    id: 'extension-polea', n: 'Extensión de tríceps en polea', m: 'triceps', p: ['gym'], e: 'Polea alta', img: true,
    mu: 'Tríceps',
    d: 'El ejercicio más popular para los tríceps.',
    s: ['De pie frente a la polea alta, sujeta la barra con las palmas hacia abajo.',
        'Pega los codos a los costados.',
        'Empuja la barra hacia abajo hasta estirar completamente los brazos.',
        'Sube despacio hasta que los antebrazos queden paralelos al suelo.'],
    t: ['Solo se mueven los antebrazos.']
  },
  {
    id: 'press-frances', n: 'Press francés', m: 'triceps', p: ['gym'], e: 'Barra Z y banco', img: true,
    mu: 'Tríceps (cabeza larga)',
    d: 'Gran constructor de tríceps.',
    s: ['Túmbate en un banco sujetando la barra Z con los brazos estirados sobre el pecho.',
        'Sin mover los codos, baja la barra hacia la frente.',
        'Para justo antes de tocarla.',
        'Extiende los codos para volver arriba.'],
    t: ['Codos apuntando al techo, sin abrirlos.']
  },
  {
    id: 'extension-sobre-cabeza', n: 'Extensión de tríceps sobre la cabeza', m: 'triceps', p: ['gym', 'casa'], q: ['mancuernas'], e: 'Mancuerna', img: true,
    mu: 'Tríceps (cabeza larga)',
    d: 'Estira y trabaja la parte más grande del tríceps.',
    s: ['De pie o sentado, sujeta una mancuerna con ambas manos por encima de la cabeza.',
        'Baja la mancuerna por detrás de la cabeza doblando los codos.',
        'Mantén los codos cerca de la cabeza apuntando al techo.',
        'Extiende los brazos para volver arriba.'],
    t: ['Aprieta el abdomen para no arquear la espalda.']
  },
  {
    id: 'patada-triceps', n: 'Patada de tríceps', m: 'triceps', p: ['gym', 'casa'], q: ['mancuernas'], e: 'Mancuerna', img: true,
    mu: 'Tríceps',
    d: 'Aislamiento con contracción máxima.',
    s: ['Inclina el torso hacia delante apoyando una mano en un banco o silla.',
        'Sube el codo pegado al costado con el antebrazo colgando.',
        'Extiende el codo llevando la mancuerna hacia atrás.',
        'Aprieta el tríceps un segundo y vuelve despacio.'],
    t: ['El brazo (de hombro a codo) no se mueve.']
  },
  {
    id: 'fondos-silla', n: 'Fondos en silla o banco', m: 'triceps', p: ['casa', 'gym'], q: [], e: 'Silla o banco', img: true,
    mu: 'Tríceps, hombros y pecho',
    d: 'El ejercicio de tríceps más fácil de hacer en casa.',
    s: ['Siéntate en el borde de una silla firme y apoya las manos a los lados de la cadera.',
        'Desliza la cadera hacia delante con las piernas estiradas o flexionadas.',
        'Baja doblando los codos hasta unos 90°.',
        'Empuja hasta estirar los brazos.'],
    t: ['Mantén la espalda cerca de la silla.', 'Rodillas dobladas = más fácil.']
  },
  {
    id: 'flexiones-diamante', n: 'Flexiones cerradas (diamante)', m: 'triceps', p: ['casa', 'gym'], q: [], e: 'Peso corporal', img: true,
    mu: 'Tríceps y pectoral',
    d: 'Flexiones con las manos juntas para enfocar el tríceps.',
    s: ['Colócate en posición de flexión con las manos juntas bajo el pecho.',
        'Mantén el cuerpo recto.',
        'Baja con los codos pegados al cuerpo.',
        'Empuja hasta estirar los brazos.'],
    t: ['Apoya las rodillas si te cuesta.']
  },

  /* ============ PIERNAS ============ */
  {
    id: 'sentadilla-barra', n: 'Sentadilla con barra', m: 'piernas', p: ['gym'], e: 'Barra y rack', img: true,
    mu: 'Cuádriceps, glúteos, femorales y core',
    d: 'El ejercicio fundamental para las piernas.',
    s: ['Coloca la barra sobre los trapecios y sácala del rack.',
        'Pies a la anchura de los hombros con las puntas un poco hacia fuera.',
        'Baja llevando la cadera atrás y abajo, rodillas en la dirección de los pies.',
        'Llega al menos a muslos paralelos y sube empujando el suelo.'],
    t: ['Espalda recta y pecho arriba.', 'Usa los topes de seguridad del rack.']
  },
  {
    id: 'prensa', n: 'Prensa de piernas', m: 'piernas', p: ['gym'], e: 'Máquina de prensa', img: true,
    mu: 'Cuádriceps y glúteos',
    d: 'Mucho trabajo de piernas con la espalda apoyada.',
    s: ['Siéntate con la espalda bien apoyada y los pies en el centro de la plataforma.',
        'Quita los seguros y estira las piernas sin bloquear las rodillas.',
        'Baja la plataforma doblando las rodillas hasta unos 90°.',
        'Empuja con todo el pie para volver arriba.'],
    t: ['No despegues la zona lumbar del respaldo.']
  },
  {
    id: 'extension-cuadriceps', n: 'Extensión de cuádriceps', m: 'piernas', p: ['gym'], e: 'Máquina', img: true,
    mu: 'Cuádriceps (aislamiento)',
    d: 'Aísla la parte delantera del muslo.',
    s: ['Siéntate con las rodillas alineadas con el eje de la máquina.',
        'Coloca el rodillo sobre los tobillos.',
        'Estira las piernas y aprieta arriba un segundo.',
        'Baja despacio.'],
    t: ['Sujétate de los agarres para no levantarte del asiento.']
  },
  {
    id: 'curl-femoral', n: 'Curl femoral tumbado', m: 'piernas', p: ['gym'], e: 'Máquina', img: true,
    mu: 'Isquiotibiales (femorales)',
    d: 'Fortalece la parte trasera del muslo.',
    s: ['Túmbate boca abajo con el rodillo justo encima de los talones.',
        'Agarra los soportes y pega la cadera al banco.',
        'Flexiona las rodillas llevando los talones hacia los glúteos.',
        'Baja despacio sin dejar caer el peso.'],
    t: ['No levantes la cadera del banco.']
  },
  {
    id: 'peso-muerto-rumano', n: 'Peso muerto rumano con barra', m: 'piernas', p: ['gym'], e: 'Barra', img: true,
    mu: 'Femorales, glúteos y lumbares',
    d: 'El mejor ejercicio para la parte trasera de la pierna.',
    s: ['De pie con la barra frente a los muslos y las rodillas un poco flexionadas.',
        'Lleva la cadera hacia atrás deslizando la barra pegada a las piernas.',
        'Baja hasta sentir el estiramiento en los femorales (mitad de la tibia aprox.).',
        'Vuelve empujando la cadera hacia delante y aprieta glúteos.'],
    t: ['La espalda siempre recta.', 'Las rodillas casi no se mueven.']
  },
  {
    id: 'peso-muerto-rumano-mancuernas', n: 'Peso muerto rumano con mancuernas', m: 'piernas', p: ['gym', 'casa'], q: ['mancuernas'], e: 'Mancuernas', img: true,
    mu: 'Femorales, glúteos y lumbares',
    d: 'La versión con mancuernas, perfecta para casa.',
    s: ['De pie con una mancuerna en cada mano delante de los muslos.',
        'Con las rodillas un poco flexionadas, lleva la cadera hacia atrás.',
        'Baja las mancuernas pegadas a las piernas hasta sentir el estiramiento.',
        'Sube apretando los glúteos.'],
    t: ['Piensa en "cerrar una puerta con el trasero".']
  },
  {
    id: 'sentadilla-goblet', n: 'Sentadilla goblet', m: 'piernas', p: ['gym', 'casa'], q: ['mancuernas'], e: 'Mancuerna o kettlebell', img: true,
    mu: 'Cuádriceps, glúteos y core',
    d: 'La mejor sentadilla para aprender la técnica.',
    s: ['Sujeta una mancuerna en vertical pegada al pecho.',
        'Pies algo más abiertos que la cadera.',
        'Baja con el torso erguido llevando los codos entre las rodillas.',
        'Sube empujando el suelo con todo el pie.'],
    t: ['Mantén los talones apoyados.']
  },
  {
    id: 'sentadilla-libre', n: 'Sentadilla con peso corporal', m: 'piernas', p: ['casa', 'gym'], q: [], e: 'Peso corporal', img: true,
    mu: 'Cuádriceps y glúteos',
    d: 'La base de todo entrenamiento de piernas en casa.',
    s: ['De pie con los pies a la anchura de los hombros.',
        'Extiende los brazos al frente para equilibrarte.',
        'Baja como si te sentaras en una silla, pecho arriba.',
        'Sube hasta estirar las piernas apretando glúteos.'],
    t: ['Las rodillas siguen la dirección de las puntas de los pies.']
  },
  {
    id: 'sentadilla-salto', n: 'Sentadilla con salto', m: 'piernas', p: ['casa', 'gym'], q: [], e: 'Peso corporal', img: true,
    mu: 'Cuádriceps, glúteos y potencia',
    d: 'Explosiva: piernas y cardio a la vez.',
    s: ['Colócate como para una sentadilla normal.',
        'Baja hasta unos 90°.',
        'Salta lo más alto que puedas extendiendo cadera y rodillas.',
        'Aterriza suave con las rodillas flexionadas y encadena la siguiente.'],
    t: ['Aterriza en silencio: amortigua con las piernas.']
  },
  {
    id: 'zancadas', n: 'Zancadas', m: 'piernas', p: ['casa', 'gym'], q: [], e: 'Peso corporal o mancuernas', img: true,
    mu: 'Cuádriceps, glúteos y equilibrio',
    d: 'Trabajo unilateral muy completo.',
    s: ['De pie, da un paso largo hacia delante.',
        'Baja hasta que ambas rodillas formen unos 90°.',
        'La rodilla trasera casi roza el suelo.',
        'Empuja con la pierna delantera para volver y alterna.'],
    t: ['Torso erguido.', 'Añade mancuernas cuando te resulte fácil.']
  },
  {
    id: 'sentadilla-bulgara', n: 'Sentadilla búlgara', m: 'piernas', p: ['casa', 'gym'], q: [], e: 'Silla o banco', img: true,
    mu: 'Cuádriceps y glúteos',
    d: 'Una de las mejores para piernas en casa.',
    s: ['De espaldas a una silla o banco, apoya el empeine de un pie sobre él.',
        'Adelanta el otro pie lo suficiente para bajar cómodo.',
        'Baja la cadera hasta que el muslo delantero quede paralelo al suelo.',
        'Sube empujando con la pierna delantera. Completa todas y cambia.'],
    t: ['Inclinar el torso un poco carga más el glúteo.']
  },
  {
    id: 'step-up', n: 'Subidas al cajón (step-up)', m: 'piernas', p: ['casa', 'gym'], q: [], e: 'Silla firme, escalón o cajón', img: true,
    mu: 'Cuádriceps y glúteos',
    d: 'Funcional y sencillo.',
    s: ['Colócate frente a un cajón o silla firme.',
        'Apoya un pie completo encima.',
        'Sube empujando con esa pierna hasta quedar de pie arriba.',
        'Baja controlando y repite.'],
    t: ['No te impulses con la pierna de abajo.']
  },
  {
    id: 'pantorrillas', n: 'Elevación de talones', m: 'piernas', p: ['casa', 'gym'], q: [], e: 'Escalón, mancuernas o máquina', img: true,
    mu: 'Gemelos y sóleo',
    d: 'Para unas pantorrillas fuertes.',
    s: ['De pie (mejor con las puntas sobre un escalón).',
        'Sube sobre las puntas de los pies lo más alto posible.',
        'Aguanta un segundo arriba.',
        'Baja lento por debajo de la altura del escalón.'],
    t: ['Rango completo y lento: las pantorrillas responden al estiramiento.']
  },

  /* ============ GLÚTEOS ============ */
  {
    id: 'hip-thrust', n: 'Hip thrust con barra', m: 'gluteos', p: ['gym'], e: 'Barra y banco', img: true,
    mu: 'Glúteo mayor y femorales',
    d: 'El ejercicio número uno para glúteos.',
    s: ['Siéntate en el suelo con la espalda alta apoyada en el banco y la barra sobre la cadera.',
        'Pies a la anchura de la cadera, rodillas flexionadas.',
        'Empuja la cadera hacia arriba hasta alinear rodillas, cadera y hombros.',
        'Aprieta los glúteos arriba y baja controlando.'],
    t: ['Usa una almohadilla en la barra.', 'Mira al frente, no al techo.']
  },
  {
    id: 'puente-gluteo', n: 'Puente de glúteo', m: 'gluteos', p: ['casa', 'gym'], q: [], e: 'Peso corporal', img: true,
    mu: 'Glúteos y femorales',
    d: 'Activa y fortalece los glúteos en casa.',
    s: ['Túmbate boca arriba con las rodillas flexionadas y los pies apoyados.',
        'Brazos a los lados del cuerpo.',
        'Eleva la cadera apretando los glúteos.',
        'Aguanta 1–2 segundos arriba y baja despacio.'],
    t: ['Empuja con los talones.']
  },
  {
    id: 'puente-una-pierna', n: 'Puente de glúteo a una pierna', m: 'gluteos', p: ['casa', 'gym'], q: [], e: 'Peso corporal', img: true,
    mu: 'Glúteos, femorales y estabilidad',
    d: 'Más intenso que el puente normal.',
    s: ['Túmbate boca arriba con una pierna flexionada y la otra estirada.',
        'Eleva la cadera empujando con el talón apoyado.',
        'Mantén la cadera nivelada arriba.',
        'Baja despacio. Completa todas y cambia de pierna.'],
    t: ['No dejes que la cadera se gire.']
  },
  {
    id: 'patada-polea', n: 'Patada de glúteo en polea', m: 'gluteos', p: ['gym'], e: 'Polea baja con tobillera', img: true,
    mu: 'Glúteo mayor',
    d: 'Aísla el glúteo con tensión constante.',
    s: ['Coloca la tobillera en la polea baja y sujétate de la máquina.',
        'Con el torso un poco inclinado, lleva la pierna hacia atrás.',
        'Aprieta el glúteo al final sin arquear la espalda.',
        'Vuelve despacio.'],
    t: ['El movimiento es corto: no fuerces la zona lumbar.']
  },
  {
    id: 'abduccion-lateral', n: 'Abducción de cadera de pie', m: 'gluteos', p: ['casa', 'gym'], q: [], e: 'Peso corporal (silla para apoyarte)', img: true,
    mu: 'Glúteo medio y abductores',
    d: 'Trabaja el lateral del glúteo sin material.',
    s: ['De pie, apóyate con una mano en una silla o pared.',
        'Con la pierna estirada, elévala hacia el lado sin inclinar el torso.',
        'Sube hasta unos 30–45° y aguanta un segundo.',
        'Baja despacio. Completa todas y cambia de pierna.'],
    t: ['La punta del pie mira al frente, no al techo.', 'Añade una mini banda en los tobillos para más dificultad.']
  },
  {
    id: 'extension-cadera-banda', n: 'Extensión de cadera con banda', m: 'gluteos', p: ['casa', 'gym'], q: ['banda'], e: 'Banda elástica', img: true,
    mu: 'Glúteos y femorales',
    d: 'Activa los glúteos con una banda en cualquier sitio.',
    s: ['Pisa la banda con ambos pies y sujeta los extremos a la altura de las rodillas.',
        'Inclina el torso hacia delante llevando la cadera atrás, espalda recta.',
        'Empuja la cadera hacia delante hasta quedar de pie apretando glúteos.',
        'Vuelve despacio a la posición inclinada.'],
    t: ['El movimiento sale de la cadera, no de la espalda.']
  },
  {
    id: 'abduccion-maquina', n: 'Abducción en máquina', m: 'gluteos', p: ['gym'], e: 'Máquina de abductores', img: true,
    mu: 'Glúteo medio',
    d: 'Fortalece el lateral del glúteo.',
    s: ['Siéntate con la espalda apoyada y las almohadillas en la cara externa de las rodillas.',
        'Abre las piernas empujando hacia fuera.',
        'Aguanta un segundo.',
        'Vuelve despacio sin dejar que las placas choquen.'],
    t: ['Inclinarte un poco hacia delante activa más el glúteo.']
  },
  {
    id: 'caminata-banda', n: 'Caminata lateral con banda', m: 'gluteos', p: ['casa', 'gym'], q: ['banda'], e: 'Mini banda', img: true,
    mu: 'Glúteo medio',
    d: 'Activación de glúteos ideal antes de entrenar piernas.',
    s: ['Coloca la mini banda por encima de las rodillas o en los tobillos.',
        'Flexiona un poco cadera y rodillas.',
        'Da pasos laterales manteniendo la tensión de la banda.',
        'Haz las repeticiones hacia un lado y vuelve.'],
    t: ['No juntes los pies del todo entre pasos.']
  },

  /* ============ CORE ============ */
  {
    id: 'plancha', n: 'Plancha', m: 'core', p: ['casa', 'gym'], q: [], e: 'Peso corporal', u: 'seg', img: true,
    mu: 'Abdomen, transverso y lumbares',
    d: 'Base de un core fuerte.',
    s: ['Apoya los antebrazos en el suelo con los codos bajo los hombros.',
        'Estira las piernas apoyando las puntas de los pies.',
        'Forma una línea recta apretando abdomen y glúteos.',
        'Mantén la posición respirando con normalidad.'],
    t: ['Ni cadera arriba ni hundida.']
  },
  {
    id: 'plancha-lateral', n: 'Plancha lateral', m: 'core', p: ['casa', 'gym'], q: [], e: 'Peso corporal', u: 'seg', img: true,
    mu: 'Oblicuos y glúteo medio',
    d: 'Fortalece los laterales del abdomen.',
    s: ['Túmbate de lado apoyado en un antebrazo, codo bajo el hombro.',
        'Eleva la cadera hasta formar una línea recta.',
        'Mantén la posición.',
        'Cambia de lado.'],
    t: ['Apoya la rodilla de abajo para hacerlo más fácil.']
  },
  {
    id: 'crunch', n: 'Crunch abdominal', m: 'core', p: ['casa', 'gym'], q: [], e: 'Peso corporal', img: true,
    mu: 'Recto abdominal',
    d: 'Abdominal clásico.',
    s: ['Túmbate boca arriba con las rodillas flexionadas.',
        'Coloca las manos junto a las sienes o cruzadas en el pecho.',
        'Eleva los hombros del suelo contrayendo el abdomen.',
        'Baja despacio.'],
    t: ['No tires del cuello con las manos.']
  },
  {
    id: 'crunch-bicicleta', n: 'Crunch bicicleta', m: 'core', p: ['casa', 'gym'], q: [], e: 'Peso corporal', img: true,
    mu: 'Oblicuos y recto abdominal',
    d: 'Uno de los más efectivos para los oblicuos.',
    s: ['Túmbate boca arriba con las manos junto a la cabeza y las piernas elevadas.',
        'Lleva un codo hacia la rodilla contraria mientras estiras la otra pierna.',
        'Alterna los lados como si pedalearas.',
        'Cuenta cada lado como una repetición.'],
    t: ['Movimiento controlado, no rápido.']
  },
  {
    id: 'elevacion-piernas', n: 'Elevación de piernas tumbado', m: 'core', p: ['casa', 'gym'], q: [], e: 'Suelo o banco', img: true,
    mu: 'Abdomen inferior',
    d: 'Trabaja la parte baja del abdomen.',
    s: ['Túmbate boca arriba con las piernas estiradas y las manos bajo los glúteos.',
        'Eleva las piernas juntas hasta la vertical.',
        'Baja despacio sin tocar el suelo.',
        'Mantén la zona lumbar pegada.'],
    t: ['Si la espalda se despega, dobla un poco las rodillas.']
  },
  {
    id: 'elevacion-piernas-colgado', n: 'Elevación de piernas colgado', m: 'core', p: ['gym', 'casa'], q: ['barra'], e: 'Barra de dominadas', img: true,
    mu: 'Abdomen inferior y flexores de cadera',
    d: 'Avanzado y muy efectivo.',
    s: ['Cuélgate de la barra con los brazos estirados.',
        'Sube las piernas (o rodillas) hasta la altura de la cadera o más.',
        'Baja controlando.',
        'Evita balancearte.'],
    t: ['Principiantes: sube las rodillas dobladas.']
  },
  {
    id: 'russian-twist', n: 'Giros rusos (russian twist)', m: 'core', p: ['casa', 'gym'], q: [], e: 'Peso opcional', img: true,
    mu: 'Oblicuos',
    d: 'Rotación para un core completo.',
    s: ['Siéntate con las rodillas flexionadas e inclina el torso hacia atrás.',
        'Eleva los pies del suelo si puedes.',
        'Gira el torso llevando las manos a un lado y luego al otro.',
        'Cada giro cuenta como una repetición.'],
    t: ['Gira el tronco, no solo los brazos.']
  },
  {
    id: 'dead-bug', n: 'Dead bug', m: 'core', p: ['casa', 'gym'], q: [], e: 'Peso corporal', img: true,
    mu: 'Transverso y abdomen profundo',
    d: 'Seguro para la espalda y muy efectivo.',
    s: ['Túmbate boca arriba con los brazos hacia el techo y las rodillas a 90°.',
        'Pega la zona lumbar al suelo.',
        'Estira a la vez un brazo hacia atrás y la pierna contraria.',
        'Vuelve y alterna.'],
    t: ['Si la espalda se despega, reduce el recorrido.']
  },
  {
    id: 'rueda-abdominal', n: 'Rueda abdominal', m: 'core', p: ['casa', 'gym'], q: ['rueda'], e: 'Rueda abdominal', img: true,
    mu: 'Abdomen completo y dorsales',
    d: 'Uno de los ejercicios de core más duros.',
    s: ['De rodillas, sujeta la rueda bajo los hombros.',
        'Rueda hacia delante estirando el cuerpo sin hundir la cadera.',
        'Llega tan lejos como puedas controlar.',
        'Vuelve tirando con el abdomen.'],
    t: ['Empieza con recorridos cortos.']
  },
  {
    id: 'crunch-polea', n: 'Crunch en polea', m: 'core', p: ['gym'], e: 'Polea alta con cuerda', img: true,
    mu: 'Recto abdominal',
    d: 'Abdominales con carga progresiva.',
    s: ['Arrodíllate frente a la polea alta sujetando la cuerda junto a la cabeza.',
        'Flexiona el tronco llevando los codos hacia los muslos.',
        'Contrae el abdomen abajo.',
        'Vuelve despacio.'],
    t: ['La cadera no se mueve: solo flexiona la columna.']
  },

  /* ============ CARDIO ============ */
  {
    id: 'jumping-jacks', n: 'Saltos de estrella (jumping jacks)', m: 'cardio', p: ['casa', 'gym'], q: [], e: 'Peso corporal', u: 'seg', img: true,
    mu: 'Cuerpo completo',
    d: 'Calentamiento y cardio sin material.',
    s: ['De pie con los pies juntos y los brazos a los lados.',
        'Salta abriendo piernas y brazos a la vez.',
        'Vuelve a cerrar con otro salto.',
        'Mantén un ritmo constante.'],
    t: ['Aterriza sobre la parte delantera del pie.']
  },
  {
    id: 'burpees', n: 'Burpees', m: 'cardio', p: ['casa', 'gym'], q: [], e: 'Peso corporal', img: true,
    mu: 'Cuerpo completo y cardio',
    d: 'El ejercicio de cardio sin material más completo.',
    s: ['De pie, baja en cuclillas y apoya las manos en el suelo.',
        'Salta con los pies hacia atrás hasta quedar en plancha.',
        'Vuelve a llevar los pies junto a las manos.',
        'Salta hacia arriba estirando los brazos y repite.'],
    t: ['Añade una flexión en la plancha para hacerlo más duro.', 'Si te cuesta, da pasos atrás en vez de saltar.']
  },
  {
    id: 'mountain-climbers', n: 'Escaladores (mountain climbers)', m: 'cardio', p: ['casa', 'gym'], q: [], e: 'Peso corporal', u: 'seg', img: true,
    mu: 'Core, hombros y cardio',
    d: 'Cardio y abdomen a la vez.',
    s: ['Colócate en plancha alta con las manos bajo los hombros.',
        'Lleva una rodilla hacia el pecho.',
        'Cambia de pierna rápidamente como si corrieras.',
        'Mantén la cadera baja.'],
    t: ['Los hombros siempre encima de las manos.']
  },
  {
    id: 'comba', n: 'Saltar la cuerda', m: 'cardio', p: ['casa', 'gym'], q: ['cuerda'], e: 'Cuerda', u: 'min', img: true,
    mu: 'Gemelos, coordinación y cardio',
    d: 'Quema muchas calorías en poco tiempo.',
    s: ['Sujeta los mangos a la altura de la cadera.',
        'Gira la cuerda con las muñecas, no con los brazos.',
        'Salta lo justo para que pase la cuerda.',
        'Aterriza sobre la parte delantera del pie.'],
    t: ['Empieza con intervalos de 30 segundos.']
  },
  {
    id: 'cinta', n: 'Cinta de correr', m: 'cardio', p: ['gym'], e: 'Cinta', u: 'min', img: true,
    mu: 'Cardio',
    d: 'Caminar inclinado o correr.',
    s: ['Sube a la cinta y empieza caminando 2–3 minutos.',
        'Aumenta la velocidad o la inclinación.',
        'Mantén una postura erguida sin agarrarte.',
        'Termina bajando el ritmo para enfriar.'],
    t: ['Caminar con 8–12% de inclinación es un gran cardio de bajo impacto.']
  },
  {
    id: 'bici-estatica', n: 'Bicicleta estática', m: 'cardio', p: ['gym', 'casa'], q: ['bici'], e: 'Bicicleta estática', u: 'min', img: true,
    mu: 'Cardio y piernas',
    d: 'Cardio sin impacto en las articulaciones.',
    s: ['Ajusta el sillín a la altura de la cadera.',
        'Pedalea con una resistencia que te permita hablar con esfuerzo.',
        'Alterna tramos suaves e intensos si buscas quemar grasa.',
        'Termina con 2 minutos suaves.'],
    t: ['La rodilla casi se estira abajo, sin bloquearse.']
  },
  {
    id: 'remo-ergometro', n: 'Remo ergómetro', m: 'cardio', p: ['gym'], e: 'Máquina de remo', u: 'min', img: true,
    mu: 'Cuerpo completo y cardio',
    d: 'Cardio que también trabaja la espalda.',
    s: ['Siéntate y sujeta los pies con las cintas.',
        'Empuja primero con las piernas.',
        'Luego inclina el torso atrás y tira del agarre hacia el abdomen.',
        'Vuelve en orden inverso: brazos, torso y piernas.'],
    t: ['El 60% de la fuerza sale de las piernas.']
  },
  {
    id: 'eliptica', n: 'Elíptica', m: 'cardio', p: ['gym'], e: 'Elíptica', u: 'min', img: true,
    mu: 'Cardio y cuerpo completo',
    d: 'Cardio de bajo impacto.',
    s: ['Sube y sujeta los agarres móviles.',
        'Empieza a un ritmo suave para calentar.',
        'Empuja y tira con los brazos mientras pedaleas.',
        'Ajusta la resistencia según tu objetivo.'],
    t: ['Mantén el torso erguido.']
  }
];

/* Ejercicios de versiones anteriores: ya no aparecen en la biblioteca,
 * pero se conservan para que tu historial siga mostrando su nombre. */
window.GB_LEGACY = [
  { id: 'remo-banda', n: 'Remo con banda elástica', m: 'espalda', p: ['casa'], q: ['banda'] },
  { id: 'flexiones-pike', n: 'Flexiones pike', m: 'hombros', p: ['casa'], q: [] },
  { id: 'curl-mochila', n: 'Curl con mochila', m: 'biceps', p: ['casa'], q: [] },
  { id: 'sentadilla-pared', n: 'Sentadilla isométrica en pared', m: 'piernas', p: ['casa'], q: [], u: 'seg' },
  { id: 'saltos-rodillas', n: 'Saltos con rodillas al pecho', m: 'cardio', p: ['casa', 'gym'], q: [] },
  { id: 'patada-cuadrupedia', n: 'Patada de glúteo en cuadrupedia', m: 'gluteos', p: ['casa', 'gym'], q: [] },
  { id: 'high-knees', n: 'Rodillas al pecho', m: 'cardio', p: ['casa'], q: [], u: 'seg' }
];
