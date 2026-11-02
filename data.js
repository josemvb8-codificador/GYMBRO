/* GYMBRO — biblioteca de ejercicios
 * id: identificador único
 * n:  nombre
 * m:  grupo muscular (ver GB_MUSCLES)
 * p:  dónde se puede hacer: 'casa', 'gym'
 * e:  equipo necesario
 * u:  unidad de la segunda columna: 'reps' (por defecto), 'seg' o 'min'
 * d:  descripción breve / técnica
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

window.GB_EXERCISES = [
  // PECHO
  { id: 'press-banca', n: 'Press de banca con barra', m: 'pecho', p: ['gym'], e: 'Barra y banco', d: 'Escápulas retraídas, pies firmes. Baja la barra a la parte media del pecho y empuja de forma controlada.' },
  { id: 'press-inclinado-mancuernas', n: 'Press inclinado con mancuernas', m: 'pecho', p: ['gym', 'casa'], e: 'Mancuernas y banco inclinado', d: 'Banco a 30–45°. Baja las mancuernas hasta la altura del pecho alto y empuja juntándolas arriba.' },
  { id: 'press-mancuernas', n: 'Press plano con mancuernas', m: 'pecho', p: ['gym', 'casa'], e: 'Mancuernas y banco', d: 'Mayor rango que la barra. Codos a unos 45° del torso.' },
  { id: 'aperturas', n: 'Aperturas con mancuernas', m: 'pecho', p: ['gym', 'casa'], e: 'Mancuernas', d: 'Codos ligeramente flexionados, abre los brazos en arco hasta sentir estiramiento en el pecho.' },
  { id: 'cruce-poleas', n: 'Cruce de poleas', m: 'pecho', p: ['gym'], e: 'Poleas', d: 'Inclínate un poco hacia delante y junta las manos frente al pecho apretando.' },
  { id: 'press-maquina-pecho', n: 'Press de pecho en máquina', m: 'pecho', p: ['gym'], e: 'Máquina', d: 'Ajusta el asiento para que los agarres queden a la altura del pecho medio.' },
  { id: 'fondos-paralelas', n: 'Fondos en paralelas', m: 'pecho', p: ['gym'], e: 'Paralelas', d: 'Inclina el torso hacia delante para enfatizar pecho. Baja hasta 90° de codo.' },
  { id: 'flexiones', n: 'Flexiones', m: 'pecho', p: ['casa', 'gym'], e: 'Peso corporal', d: 'Cuerpo en línea recta, manos algo más abiertas que los hombros. Pecho casi al suelo.' },
  { id: 'flexiones-inclinadas', n: 'Flexiones inclinadas', m: 'pecho', p: ['casa'], e: 'Silla, mesa o sofá', d: 'Manos sobre una superficie elevada. Más fácil que la flexión normal; ideal para empezar.' },
  { id: 'flexiones-declinadas', n: 'Flexiones declinadas', m: 'pecho', p: ['casa'], e: 'Silla o sofá', d: 'Pies elevados. Más carga en pecho superior y hombros.' },

  // ESPALDA
  { id: 'dominadas', n: 'Dominadas', m: 'espalda', p: ['gym', 'casa'], e: 'Barra de dominadas', d: 'Agarre prono algo más ancho que los hombros. Sube hasta pasar la barbilla y baja completo.' },
  { id: 'jalon-pecho', n: 'Jalón al pecho', m: 'espalda', p: ['gym'], e: 'Polea alta', d: 'Pecho arriba, lleva la barra a la parte alta del pecho tirando con los codos.' },
  { id: 'remo-barra', n: 'Remo con barra', m: 'espalda', p: ['gym'], e: 'Barra', d: 'Torso inclinado ~45°, espalda neutra. Lleva la barra al ombligo.' },
  { id: 'remo-mancuerna', n: 'Remo con mancuerna a una mano', m: 'espalda', p: ['gym', 'casa'], e: 'Mancuerna y banco/silla', d: 'Apoya mano y rodilla. Tira de la mancuerna hacia la cadera, sin girar el torso.' },
  { id: 'remo-polea-baja', n: 'Remo en polea baja', m: 'espalda', p: ['gym'], e: 'Polea baja', d: 'Espalda recta, lleva el agarre al abdomen juntando las escápulas.' },
  { id: 'peso-muerto', n: 'Peso muerto', m: 'espalda', p: ['gym'], e: 'Barra', d: 'Barra pegada a las piernas, espalda neutra. Empuja el suelo y extiende cadera y rodillas a la vez.' },
  { id: 'remo-invertido', n: 'Remo invertido bajo mesa', m: 'espalda', p: ['casa'], e: 'Mesa resistente', d: 'Túmbate bajo una mesa firme, agarra el borde y sube el pecho hacia ella con el cuerpo recto.' },
  { id: 'remo-banda', n: 'Remo con banda elástica', m: 'espalda', p: ['casa'], e: 'Banda elástica', d: 'Ancla la banda a la altura del pecho y tira con los codos pegados.' },
  { id: 'superman', n: 'Superman', m: 'espalda', p: ['casa'], e: 'Peso corporal', d: 'Boca abajo, eleva brazos y piernas a la vez. Mantén 1–2 s arriba.' },
  { id: 'pullover', n: 'Pullover con mancuerna', m: 'espalda', p: ['gym', 'casa'], e: 'Mancuerna', d: 'Tumbado, lleva la mancuerna detrás de la cabeza con brazos casi rectos y vuelve.' },

  // HOMBROS
  { id: 'press-militar', n: 'Press militar con barra', m: 'hombros', p: ['gym'], e: 'Barra', d: 'De pie, glúteos y abdomen firmes. Empuja la barra por encima de la cabeza.' },
  { id: 'press-hombro-mancuernas', n: 'Press de hombro con mancuernas', m: 'hombros', p: ['gym', 'casa'], e: 'Mancuernas', d: 'Sentado o de pie, empuja desde la altura de las orejas hasta arriba.' },
  { id: 'elevaciones-laterales', n: 'Elevaciones laterales', m: 'hombros', p: ['gym', 'casa'], e: 'Mancuernas o botellas', d: 'Sube los brazos a los lados hasta la altura de los hombros, codos ligeramente flexionados.' },
  { id: 'elevaciones-frontales', n: 'Elevaciones frontales', m: 'hombros', p: ['gym', 'casa'], e: 'Mancuernas o disco', d: 'Eleva al frente hasta la altura de los ojos, sin balancear.' },
  { id: 'pajaros', n: 'Pájaros (deltoide posterior)', m: 'hombros', p: ['gym', 'casa'], e: 'Mancuernas', d: 'Torso inclinado, abre los brazos hacia los lados apretando la parte trasera del hombro.' },
  { id: 'face-pull', n: 'Face pull', m: 'hombros', p: ['gym'], e: 'Polea con cuerda', d: 'Tira de la cuerda hacia la cara separando las manos. Excelente para la salud del hombro.' },
  { id: 'flexiones-pike', n: 'Flexiones pike', m: 'hombros', p: ['casa'], e: 'Peso corporal', d: 'Cadera arriba en forma de V invertida; baja la cabeza hacia el suelo entre las manos.' },

  // BÍCEPS
  { id: 'curl-barra', n: 'Curl con barra', m: 'biceps', p: ['gym'], e: 'Barra', d: 'Codos fijos a los costados. Sube sin balancear el torso.' },
  { id: 'curl-mancuernas', n: 'Curl con mancuernas', m: 'biceps', p: ['gym', 'casa'], e: 'Mancuernas', d: 'Gira la muñeca (supinación) al subir. Baja lento.' },
  { id: 'curl-martillo', n: 'Curl martillo', m: 'biceps', p: ['gym', 'casa'], e: 'Mancuernas', d: 'Agarre neutro (palmas enfrentadas). Trabaja también el antebrazo.' },
  { id: 'curl-polea', n: 'Curl en polea', m: 'biceps', p: ['gym'], e: 'Polea baja', d: 'Tensión constante. Codos quietos.' },
  { id: 'curl-predicador', n: 'Curl predicador', m: 'biceps', p: ['gym'], e: 'Banco predicador', d: 'Brazos apoyados; evita bloquear el codo abajo.' },
  { id: 'curl-banda', n: 'Curl con banda elástica', m: 'biceps', p: ['casa'], e: 'Banda elástica', d: 'Pisa la banda y sube como un curl normal.' },
  { id: 'curl-mochila', n: 'Curl con mochila', m: 'biceps', p: ['casa'], e: 'Mochila con libros/agua', d: 'Agarra la mochila por el asa y haz curl. Ajusta el peso con lo que metas dentro.' },

  // TRÍCEPS
  { id: 'extension-polea', n: 'Extensión de tríceps en polea', m: 'triceps', p: ['gym'], e: 'Polea alta', d: 'Codos pegados al cuerpo, extiende hasta abajo por completo.' },
  { id: 'press-frances', n: 'Press francés', m: 'triceps', p: ['gym'], e: 'Barra Z y banco', d: 'Tumbado, baja la barra hacia la frente doblando solo los codos.' },
  { id: 'extension-sobre-cabeza', n: 'Extensión sobre la cabeza', m: 'triceps', p: ['gym', 'casa'], e: 'Mancuerna', d: 'Sujeta una mancuerna con ambas manos detrás de la cabeza y extiende hacia arriba.' },
  { id: 'patada-triceps', n: 'Patada de tríceps', m: 'triceps', p: ['gym', 'casa'], e: 'Mancuerna', d: 'Torso inclinado, brazo pegado al costado; extiende el codo hacia atrás.' },
  { id: 'fondos-silla', n: 'Fondos en silla', m: 'triceps', p: ['casa'], e: 'Silla o banco', d: 'Manos en el borde de la silla, baja doblando codos hasta 90° y sube.' },
  { id: 'flexiones-diamante', n: 'Flexiones diamante', m: 'triceps', p: ['casa', 'gym'], e: 'Peso corporal', d: 'Manos juntas formando un diamante bajo el pecho.' },

  // PIERNAS
  { id: 'sentadilla-barra', n: 'Sentadilla con barra', m: 'piernas', p: ['gym'], e: 'Barra y rack', d: 'Barra sobre trapecios, rodillas siguiendo la punta de los pies. Baja al menos a paralelo.' },
  { id: 'prensa', n: 'Prensa de piernas', m: 'piernas', p: ['gym'], e: 'Máquina de prensa', d: 'No despegues la zona lumbar del respaldo. No bloquees rodillas arriba.' },
  { id: 'extension-cuadriceps', n: 'Extensión de cuádriceps', m: 'piernas', p: ['gym'], e: 'Máquina', d: 'Extiende las rodillas y aprieta arriba 1 s.' },
  { id: 'curl-femoral', n: 'Curl femoral', m: 'piernas', p: ['gym'], e: 'Máquina', d: 'Flexiona las rodillas llevando el talón hacia el glúteo, baja lento.' },
  { id: 'peso-muerto-rumano', n: 'Peso muerto rumano', m: 'piernas', p: ['gym', 'casa'], e: 'Barra o mancuernas', d: 'Rodillas semiflexionadas, lleva la cadera atrás hasta sentir el femoral.' },
  { id: 'sentadilla-goblet', n: 'Sentadilla goblet', m: 'piernas', p: ['gym', 'casa'], e: 'Mancuerna o kettlebell', d: 'Sujeta el peso pegado al pecho y baja con el torso erguido.' },
  { id: 'sentadilla-libre', n: 'Sentadilla con peso corporal', m: 'piernas', p: ['casa'], e: 'Peso corporal', d: 'Pies al ancho de hombros, baja como si te sentaras en una silla.' },
  { id: 'zancadas', n: 'Zancadas', m: 'piernas', p: ['casa', 'gym'], e: 'Peso corporal o mancuernas', d: 'Paso largo, baja hasta que ambas rodillas formen 90°. Alterna piernas.' },
  { id: 'sentadilla-bulgara', n: 'Sentadilla búlgara', m: 'piernas', p: ['casa', 'gym'], e: 'Silla o banco', d: 'Pie trasero apoyado en una silla; baja con la pierna delantera.' },
  { id: 'step-up', n: 'Subidas al cajón (step-up)', m: 'piernas', p: ['casa', 'gym'], e: 'Silla firme o cajón', d: 'Sube empujando con la pierna de arriba, sin impulsarte con la de abajo.' },
  { id: 'sentadilla-pared', n: 'Sentadilla isométrica en pared', m: 'piernas', p: ['casa'], e: 'Pared', u: 'seg', d: 'Espalda contra la pared, rodillas a 90°. Mantén la posición.' },
  { id: 'pantorrillas', n: 'Elevación de talones', m: 'piernas', p: ['casa', 'gym'], e: 'Escalón o máquina', d: 'Sube sobre las puntas de los pies lo más alto posible y baja lento.' },

  // GLÚTEOS
  { id: 'hip-thrust', n: 'Hip thrust con barra', m: 'gluteos', p: ['gym'], e: 'Barra y banco', d: 'Espalda alta apoyada en el banco, empuja la cadera hacia arriba apretando glúteos.' },
  { id: 'puente-gluteo', n: 'Puente de glúteo', m: 'gluteos', p: ['casa'], e: 'Peso corporal', d: 'Tumbado boca arriba, eleva la cadera y aprieta 1–2 s arriba.' },
  { id: 'puente-una-pierna', n: 'Puente de glúteo a una pierna', m: 'gluteos', p: ['casa'], e: 'Peso corporal', d: 'Igual que el puente pero con una pierna extendida. Más intenso.' },
  { id: 'patada-polea', n: 'Patada de glúteo en polea', m: 'gluteos', p: ['gym'], e: 'Polea con tobillera', d: 'Extiende la cadera hacia atrás sin arquear la espalda.' },
  { id: 'patada-cuadrupedia', n: 'Patada de glúteo en cuadrupedia', m: 'gluteos', p: ['casa'], e: 'Peso corporal', d: 'A cuatro patas, eleva una pierna flexionada hacia el techo.' },
  { id: 'abduccion-maquina', n: 'Abducción en máquina', m: 'gluteos', p: ['gym'], e: 'Máquina', d: 'Abre las piernas contra la resistencia, controla la vuelta.' },
  { id: 'caminata-banda', n: 'Caminata lateral con banda', m: 'gluteos', p: ['casa', 'gym'], e: 'Mini banda', d: 'Banda sobre las rodillas, semi-sentadilla y pasos laterales.' },

  // CORE
  { id: 'plancha', n: 'Plancha', m: 'core', p: ['casa', 'gym'], e: 'Peso corporal', u: 'seg', d: 'Antebrazos en el suelo, cuerpo recto, abdomen y glúteos apretados.' },
  { id: 'plancha-lateral', n: 'Plancha lateral', m: 'core', p: ['casa', 'gym'], e: 'Peso corporal', u: 'seg', d: 'De lado sobre un antebrazo, cadera arriba. Cambia de lado.' },
  { id: 'crunch', n: 'Crunch abdominal', m: 'core', p: ['casa', 'gym'], e: 'Peso corporal', d: 'Eleva los hombros del suelo contrayendo el abdomen, sin tirar del cuello.' },
  { id: 'elevacion-piernas', n: 'Elevación de piernas tumbado', m: 'core', p: ['casa'], e: 'Peso corporal', d: 'Lumbar pegada al suelo, sube y baja las piernas rectas lentamente.' },
  { id: 'elevacion-piernas-colgado', n: 'Elevación de piernas colgado', m: 'core', p: ['gym'], e: 'Barra de dominadas', d: 'Colgado, sube las rodillas o piernas sin balancearte.' },
  { id: 'russian-twist', n: 'Russian twist', m: 'core', p: ['casa', 'gym'], e: 'Peso opcional', d: 'Sentado con pies elevados, gira el torso de lado a lado.' },
  { id: 'dead-bug', n: 'Dead bug', m: 'core', p: ['casa', 'gym'], e: 'Peso corporal', d: 'Boca arriba, extiende brazo y pierna contrarios manteniendo la lumbar pegada.' },
  { id: 'rueda-abdominal', n: 'Rueda abdominal', m: 'core', p: ['casa', 'gym'], e: 'Rueda abdominal', d: 'De rodillas, rueda hacia delante sin hundir la cadera y vuelve.' },
  { id: 'crunch-polea', n: 'Crunch en polea', m: 'core', p: ['gym'], e: 'Polea con cuerda', d: 'De rodillas, flexiona el tronco llevando los codos a los muslos.' },

  // CARDIO
  { id: 'burpees', n: 'Burpees', m: 'cardio', p: ['casa', 'gym'], e: 'Peso corporal', d: 'Sentadilla, manos al suelo, salto atrás a plancha, flexión opcional y salto arriba.' },
  { id: 'jumping-jacks', n: 'Jumping jacks', m: 'cardio', p: ['casa'], e: 'Peso corporal', u: 'seg', d: 'Salta abriendo piernas y brazos a la vez.' },
  { id: 'mountain-climbers', n: 'Mountain climbers', m: 'cardio', p: ['casa', 'gym'], e: 'Peso corporal', u: 'seg', d: 'En plancha alta, lleva las rodillas al pecho alternando rápido.' },
  { id: 'high-knees', n: 'Rodillas al pecho', m: 'cardio', p: ['casa'], e: 'Peso corporal', u: 'seg', d: 'Corre en el sitio subiendo las rodillas a la altura de la cadera.' },
  { id: 'comba', n: 'Saltar la cuerda', m: 'cardio', p: ['casa', 'gym'], e: 'Cuerda', u: 'min', d: 'Saltos pequeños sobre la punta de los pies, giro desde las muñecas.' },
  { id: 'cinta', n: 'Cinta de correr', m: 'cardio', p: ['gym'], e: 'Cinta', u: 'min', d: 'Caminar inclinado o correr. Anota los minutos.' },
  { id: 'bici-estatica', n: 'Bicicleta estática', m: 'cardio', p: ['gym', 'casa'], e: 'Bicicleta estática', u: 'min', d: 'Ajusta el sillín a la altura de la cadera.' },
  { id: 'remo-ergometro', n: 'Remo ergómetro', m: 'cardio', p: ['gym'], e: 'Máquina de remo', u: 'min', d: 'Piernas, luego espalda, luego brazos. Vuelve en orden inverso.' },
  { id: 'eliptica', n: 'Elíptica', m: 'cardio', p: ['gym'], e: 'Elíptica', u: 'min', d: 'Cardio de bajo impacto para las articulaciones.' }
];
