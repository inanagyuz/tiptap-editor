/**
 * @module i18n
 * @description
 * Internationalization (i18n) module for Tiptap Editor.
 * Provides multi-language support for UI labels, messages, and commands.
 * Supports Turkish, English, German, French, and Spanish.
 *
 * @example
 * ```typescript
 * import { i18n } from './i18n';
 * i18n.setLanguage('en');
 * const label = i18n.t('BOLD'); // Returns 'Bold' if language is English
 * ```
 */

/**
 * Supported language codes.
 * @typedef {'tr' | 'en' | 'de' | 'fr' | 'es'} Language
 */

/**
 * Translation dictionary type.
 * Each key maps to an object containing translations for all supported languages.
 */

type Language = 'tr' | 'en' | 'de' | 'fr' | 'es';

/**
 * Translation dictionary for all UI labels and messages.
 * Keys are used throughout the editor for multi-language support.
 */

interface Translations {
   [key: string]: {
      [K in Language]: string;
   };
}

const translations: Translations = {
   CONTEXT_AI: {
      tr: 'AI sor',
      en: 'Ask AI',
      de: 'KI fragen',
      fr: "Demander à l'IA",
      es: 'Preguntar a la IA',
   },
   TEXT: {
      tr: 'Metin',
      en: 'Text',
      de: 'Text',
      fr: 'Texte',
      es: 'Texto',
   },
   BOLD: {
      tr: 'Kalın',
      en: 'Bold',
      de: 'Fett',
      fr: 'Gras',
      es: 'Negrita',
   },
   ITALIC: {
      tr: 'İtalik',
      en: 'Italic',
      de: 'Kursiv',
      fr: 'Italique',
      es: 'Cursiva',
   },
   UNDERLINE: {
      tr: 'Altı Çizili',
      en: 'Underline',
      de: 'Unterstrichen',
      fr: 'Souligné',
      es: 'Subrayado',
   },
   STRIKETHROUGH: {
      tr: 'Üstü Çizili',
      en: 'Strikethrough',
      de: 'Durchgestrichen',
      fr: 'Barré',
      es: 'Tachado',
   },
   CODE: {
      tr: 'Kod',
      en: 'Code',
      de: 'Code',
      fr: 'Code',
      es: 'Código',
   },
   SUBSCRIPT: {
      tr: 'Alt Simge',
      en: 'Subscript',
      de: 'Tiefgestellt',
      fr: 'Indice',
      es: 'Subíndice',
   },
   SUPERSCRIPT: {
      tr: 'Üst Simge',
      en: 'Superscript',
      de: 'Hochgestellt',
      fr: 'Exposant',
      es: 'Superíndice',
   },
   HEADING: {
      tr: 'Başlık',
      en: 'Heading',
      de: 'Überschrift',
      fr: 'Titre',
      es: 'Encabezado',
   },
   PLACEHOLDER: {
      tr: 'Yazmaya başlayın veya "/" yazarak komutları görün',
      en: 'Start typing or press "/" for commands',
      de: 'Beginnen Sie zu tippen oder drücken Sie "/" für Befehle',
      fr: 'Commencez à taper ou appuyez sur "/" pour les commandes',
      es: 'Comience a escribir o presione "/" para comandos',
   },
   TABLE: {
      tr: 'Tablo',
      en: 'Table',
      de: 'Tabelle',
      fr: 'Tableau',
      es: 'Tabla',
   },
   BULLET_LIST: {
      tr: 'Madde İşaretli Liste',
      en: 'Bullet List',
      de: 'Aufzählungsliste',
      fr: 'Liste à puces',
      es: 'Lista con viñetas',
   },
   NUMBERED_LIST: {
      tr: 'Numaralandırılmış Liste',
      en: 'Numbered List',
      de: 'Nummerierte Liste',
      fr: 'Liste numérotée',
      es: 'Lista numerada',
   },
   INLINE_CODE: {
      tr: 'Satır İçi Kod',
      en: 'Inline Code',
      de: 'Inline-Code',
      fr: 'Code en ligne',
      es: 'Código en línea',
   },
   TASK_LIST: {
      tr: 'Görev Listesi',
      en: 'Task List',
      de: 'Aufgabenliste',
      fr: 'Liste de tâches',
      es: 'Lista de tareas',
   },
   BLOCK_QUOTE: {
      tr: 'Alıntı',
      en: 'Block Quote',
      de: 'Blockzitat',
      fr: 'Citation',
      es: 'Cita en bloque',
   },
   CODE_BLOCK: {
      tr: 'Kod Bloğu',
      en: 'Code Block',
      de: 'Codeblock',
      fr: 'Bloc de code',
      es: 'Bloque de código',
   },
   HORIZONTAL_RULE: {
      tr: 'Yatay Çizgi',
      en: 'Horizontal Rule',
      de: 'Horizontale Linie',
      fr: 'Règle horizontale',
      es: 'Regla horizontal',
   },
   UPLOAD_IMAGE: {
      tr: 'Resim Yükle',
      en: 'Upload Image',
      de: 'Bild hochladen',
      fr: 'Télécharger une image',
      es: 'Subir imagen',
   },
   IMAGE_URL: {
      tr: 'Resim URL',
      en: 'Image URL',
      de: 'Bild-URL',
      fr: "URL de l'image",
      es: 'URL de imagen',
   },
   IMAGE_GALLERY: {
      tr: 'Resim Galerisi',
      en: 'Image Gallery',
      de: 'Bildergalerie',
      fr: "Galerie d'images",
      es: 'Galería de imágenes',
   },
   YOUTUBE: {
      tr: 'YouTube Videosu',
      en: 'YouTube Video',
      de: 'YouTube-Video',
      fr: 'Vidéo YouTube',
      es: 'Video de YouTube',
   },
   TWITTER: {
      tr: 'Twitter Paylaşımı',
      en: 'Twitter Post',
      de: 'Twitter-Beitrag',
      fr: 'Publication Twitter',
      es: 'Publicación de Twitter',
   },
   IMPORT_CONTENT: {
      tr: 'İçeriği İçe Aktar',
      en: 'Import Content',
      de: 'Inhalt importieren',
      fr: 'Importer le contenu',
      es: 'Importar contenido',
   },
   EXPORT_CONTENT: {
      tr: 'İçeriği Dışa Aktar',
      en: 'Export Content',
      de: 'Inhalt exportieren',
      fr: 'Exporter le contenu',
      es: 'Exportar contenido',
   },
   CLEAR_FORMATTING: {
      tr: 'Biçimlendirmeyi Temizle',
      en: 'Clear Formatting',
      de: 'Formatierung löschen',
      fr: 'Effacer la mise en forme',
      es: 'Borrar formato',
   },
   LOADING_EDITOR: {
      tr: 'Editör yükleniyor...',
      en: 'Loading editor...',
      de: 'Editor wird geladen...',
      fr: "Chargement de l'éditeur...",
      es: 'Cargando editor...',
   },
   MCP_POWERED: {
      tr: 'MCP ile Güçlendirilmiş',
      en: 'MCP Powered',
      de: 'Angetrieben von MCP',
      fr: 'Propulsé par MCP',
      es: 'Impulsado por MCP',
   },
   AI_ASSISTANT_DESC: {
      tr: 'Akıllı bağlam analizi ile güçlendirilmiş AI asistanı',
      en: 'AI assistant powered by smart context analysis',
      de: 'KI-Assistent, der durch intelligente Kontextanalyse unterstützt wird',
      fr: 'Assistant IA propulsé par une analyse intelligente du contexte',
      es: 'Asistente de IA impulsado por análisis inteligente del contexto',
   },

   // Loading
   AI_THINKING: {
      tr: 'AI düşünüyor...',
      en: 'AI is thinking...',
      de: 'KI denkt nach...',
      fr: 'L’IA réfléchit...',
      es: 'La IA está pensando...',
   },
   MCP_ANALYZING: {
      tr: 'MCP analiz ediyor...',
      en: 'MCP is analyzing...',
      de: 'MCP analysiert...',
      fr: 'MCP est en train d’analyser...',
      es: 'MCP está analizando...',
   },

   // Input
   AI_INPUT_PLACEHOLDER: {
      tr: "AI'ya ne yapmasını istiyorsunuz?",
      en: 'What do you want the AI to do?',
      de: 'Was möchten Sie, dass die KI tut?',
      fr: 'Que voulez-vous que l’IA fasse ?',
      es: '¿Qué quieres que haga la IA?',
   },
   AI_NEXT_INSTRUCTION: {
      tr: 'Sonraki talimatı verin...',
      en: 'Give the next instruction...',
      de: 'Geben Sie die nächste Anweisung ein...',
      fr: 'Donnez la prochaine instruction...',
      es: 'Da la siguiente instrucción...',
   },

   // Quick Commands Section
   QUICK_COMMANDS_TITLE: {
      tr: '✨ Hızlı Metin Komutları',
      en: '✨ Quick Text Commands',
      de: '✨ Schnelle Textbefehle',
      fr: '✨ Commandes de texte rapides',
      es: '✨ Comandos de texto rápidos',
   },
   AI_SELECT_TEXT_ALERT: {
      tr: 'Lütfen düzenlemek istediğiniz metni seçin',
      en: 'Please select the text you want to edit',
      de: 'Bitte wählen Sie den Text aus, den Sie bearbeiten möchten',
      fr: 'Veuillez sélectionner le texte que vous souhaitez modifier',
      es: 'Por favor, selecciona el texto que deseas editar',
   },
   AI_CONTINUE_LABEL: {
      tr: 'Metni Devam Ettir',
      en: 'Continue text',
      de: 'Text fortsetzen',
      fr: 'Continuer le texte',
      es: 'Continuar texto',
   },
   AI_CONTINUE_DESC: {
      tr: 'Metni bağlama uygun şekilde devam ettir',
      en: 'Continue the text based on context',
      de: 'Text im Kontext fortsetzen',
      fr: 'Continuer le texte en fonction du contexte',
      es: 'Continuar el texto según el contexto',
   },
   AI_CONTINUE_COMMAND: {
      tr: 'Bu metni bağlama uygun şekilde devam ettir',
      en: 'Continue this text based on context',
      de: 'Setzen Sie diesen Text im Kontext fort',
      fr: 'Continuer ce texte en fonction du contexte',
      es: 'Continuar este texto según el contexto',
   },

   AI_IMPROVE_LABEL: {
      tr: 'Metni İyileştir',
      en: 'Improve text',
      de: 'Text verbessern',
      fr: 'Améliorer le texte',
      es: 'Mejorar texto',
   },
   AI_IMPROVE_DESC: {
      tr: 'Seçili metni daha akıcı hale getir',
      en: 'Make the selected text more fluent',
      de: 'Ausgewählten Text flüssiger machen',
      fr: 'Rendre le texte sélectionné plus fluide',
      es: 'Hacer el texto seleccionado más fluido',
   },
   AI_IMPROVE_COMMAND: {
      tr: 'Bu metni daha akıcı, net ve anlaşılır hale getir',
      en: 'Make this text more fluent, clear, and understandable',
      de: 'Machen Sie diesen Text flüssiger, klarer und verständlicher',
      fr: 'Rendre ce texte plus fluide, clair et compréhensible',
      es: 'Hacer este texto más fluido, claro y comprensible',
   },

   AI_SUMMARIZE_LABEL: {
      tr: 'Özetle',
      en: 'Summarize',
      de: 'Zusammenfassen',
      fr: 'Résumer',
      es: 'Resumir',
   },
   AI_SUMMARIZE_DESC: {
      tr: 'Metni kısaca özetle',
      en: 'Summarize the text briefly',
      de: 'Text kurz zusammenfassen',
      fr: 'Résumer brièvement le texte',
      es: 'Resumir el texto brevemente',
   },
   AI_SUMMARIZE_COMMAND: {
      tr: 'Bu metni ana noktalarını koruyarak özetle',
      en: 'Summarize this text while keeping the main points',
      de: 'Fassen Sie diesen Text zusammen und behalten Sie die Hauptpunkte bei',
      fr: 'Résumer ce texte en conservant les points principaux',
      es: 'Resumir este texto manteniendo los puntos principales',
   },

   AI_EXPAND_LABEL: {
      tr: 'Genişlet',
      en: 'Expand',
      de: 'Erweitern',
      fr: 'Développer',
      es: 'Expandir',
   },
   AI_EXPAND_DESC: {
      tr: 'Metni daha detaylandır',
      en: 'Expand the text with more details',
      de: 'Text mit mehr Details erweitern',
      fr: 'Développer le texte avec plus de détails',
      es: 'Expandir el texto con más detalles',
   },
   AI_EXPAND_COMMAND: {
      tr: 'Bu metni daha detaylı ve kapsamlı hale getir',
      en: 'Make this text more detailed and comprehensive',
      de: 'Machen Sie diesen Text detaillierter und umfassender',
      fr: 'Rendre ce texte plus détaillé et complet',
      es: 'Hacer este texto más detallado y completo',
   },

   AI_FIX_GRAMMAR_LABEL: {
      tr: 'Dilbilgisi Düzelt',
      en: 'Fix Grammar',
      de: 'Grammatik korrigieren',
      fr: 'Corriger la grammaire',
      es: 'Corregir gramática',
   },
   AI_FIX_GRAMMAR_DESC: {
      tr: 'Yazım ve dilbilgisi hatalarını düzelt',
      en: 'Correct spelling and grammar mistakes',
      de: 'Rechtschreib- und Grammatikfehler korrigieren',
      fr: 'Corriger les fautes d’orthographe et de grammaire',
      es: 'Corregir errores de ortografía y gramática',
   },
   AI_FIX_GRAMMAR_COMMAND: {
      tr: 'Bu metindeki yazım ve dilbilgisi hatalarını düzelt',
      en: 'Correct spelling and grammar mistakes in this text',
      de: 'Rechtschreib- und Grammatikfehler in diesem Text korrigieren',
      fr: 'Corriger les fautes d’orthographe et de grammaire dans ce texte',
      es: 'Corregir errores de ortografía y gramática en este texto',
   },

   AI_CHANGE_TONE_LABEL: {
      tr: 'Tonunu Değiştir',
      en: 'Change Tone',
      de: 'Ton ändern',
      fr: 'Changer le ton',
      es: 'Cambiar tono',
   },
   AI_CHANGE_TONE_DESC: {
      tr: 'Metni daha resmi/samimi yap',
      en: 'Make the text more formal/informal',
      de: 'Text formeller/informeller machen',
      fr: 'Rendre le texte plus formel/informel',
      es: 'Hacer el texto más formal/informal',
   },
   AI_CHANGE_TONE_COMMAND: {
      tr: 'Bu metni daha profesyonel bir ton ile yeniden yaz',
      en: 'Rewrite this text in a more professional tone',
      de: 'Schreiben Sie diesen Text in einem professionelleren Ton neu',
      fr: 'Réécrire ce texte dans un ton plus professionnel',
      es: 'Reescribir este texto en un tono más profesional',
   },

   AI_TRANSLATE_ENGLISH_LABEL: {
      tr: 'İngilizceye Çevir',
      en: 'Translate to English',
      de: 'Ins Englische übersetzen',
      fr: 'Traduire en anglais',
      es: 'Traducir al inglés',
   },
   AI_TRANSLATE_ENGLISH_DESC: {
      tr: "Metni İngilizce'ye çevir",
      en: 'Translate the text to English',
      de: 'Text ins Englische übersetzen',
      fr: 'Traduire le texte en anglais',
      es: 'Traducir el texto al inglés',
   },
   AI_TRANSLATE_ENGLISH_COMMAND: {
      tr: "Bu metni İngilizce'ye çevir",
      en: 'Translate this text to English',
      de: 'Übersetzen Sie diesen Text ins Englische',
      fr: 'Traduire ce texte en anglais',
      es: 'Traducir este texto al inglés',
   },

   AI_TRANSLATE_TURKISH_LABEL: {
      tr: 'Türkçeye Çevir',
      en: 'Translate to Turkish',
      de: 'Ins Türkische übersetzen',
      fr: 'Traduire en turc',
      es: 'Traducir al turco',
   },
   AI_TRANSLATE_TURKISH_DESC: {
      tr: "Metni Türkçe'ye çevir",
      en: 'Translate the text to Turkish',
      de: 'Text ins Türkische übersetzen',
      fr: 'Traduire le texte en turc',
      es: 'Traducir el texto al turco',
   },
   AI_TRANSLATE_TURKISH_COMMAND: {
      tr: "Bu metni Türkçe'ye çevir",
      en: 'Translate this text to Turkish',
      de: 'Übersetzen Sie diesen Text ins Türkische',
      fr: 'Traduire ce texte en turc',
      es: 'Traducir este texto al turco',
   },

   AI_TRANSLATE_GERMAN_LABEL: {
      tr: 'Almancaya Çevir',
      en: 'Translate to German',
      de: 'Ins Deutsche übersetzen',
      fr: 'Traduire en allemand',
      es: 'Traducir al alemán',
   },
   AI_TRANSLATE_GERMAN_DESC: {
      tr: "Metni Almanca'ya çevir",
      en: 'Translate the text to German',
      de: 'Text ins Deutsche übersetzen',
      fr: 'Traduire le texte en allemand',
      es: 'Traducir el texto al alemán',
   },
   AI_TRANSLATE_GERMAN_COMMAND: {
      tr: "Bu metni Almanca'ya çevir",
      en: 'Translate this text to German',
      de: 'Übersetzen Sie diesen Text ins Deutsche',
      fr: 'Traduire ce texte en allemand',
      es: 'Traducir este texto al alemán',
   },

   // MCP Tools Section
   MCP_TOOLS_TITLE: {
      tr: '🧠 Akıllı Bağlam Araçları',
      en: '🧠 Smart Context Tools',
      de: '🧠 Intelligente Kontextwerkzeuge',
      fr: '🧠 Outils de contexte intelligents',
      es: '🧠 Herramientas de contexto inteligente',
   },

   // MCP Tool Descriptions
   MCP_ANALYZE_PROJECT: {
      tr: 'Proje Yapısını Analiz Et',
      en: 'Analyze Project Structure',
      de: 'Projektstruktur analysieren',
      fr: 'Analyser la structure du projet',
      es: 'Analizar estructura del proyecto',
   },
   MCP_SEARCH_CODEBASE: {
      tr: 'Kod Tabanında Ara',
      en: 'Search Codebase',
      de: 'Im Code suchen',
      fr: 'Rechercher dans le code',
      es: 'Buscar en el código',
   },
   MCP_READ_DOCUMENTATION: {
      tr: 'Dokümantasyon Oku',
      en: 'Read Documentation',
      de: 'Dokumentation lesen',
      fr: 'Lire la documentation',
      es: 'Leer documentación',
   },
   MCP_QUERY_DATABASE: {
      tr: 'Veritabanı Sorgula',
      en: 'Query Database',
      de: 'Datenbank abfragen',
      fr: 'Interroger la base de données',
      es: 'Consultar base de datos',
   },
   MCP_ANALYZE_CODE: {
      tr: 'Kod Analizi Yap',
      en: 'Analyze Code',
      de: 'Code analysieren',
      fr: 'Analyser le code',
      es: 'Analizar código',
   },

   // MCP Resources Section
   MCP_RESOURCES_TITLE: {
      tr: '📁 Bağlam Kaynakları',
      en: '📁 Context Resources',
      de: '📁 Kontextressourcen',
      fr: '📁 Ressources contextuelles',
      es: '📁 Recursos de contexto',
   },

   // Accept/Retry
   AI_ACCEPT: {
      tr: 'Kabul Et',
      en: 'Accept',
      de: 'Akzeptieren',
      fr: 'Accepter',
      es: 'Aceptar',
   },
   AI_RETRY: {
      tr: 'Yeniden Dene',
      en: 'Retry',
      de: 'Erneut versuchen',
      fr: 'Réessayer',
      es: 'Reintentar',
   },

   // Error messages
   'error.invalid_url': {
      tr: 'Geçersiz URL',
      en: 'Invalid URL',
      de: 'Ungültige URL',
      fr: 'URL invalide',
      es: 'URL inválida',
   },
   CONTEXT_AI_DIALOG_DESC: {
      tr: 'ContextAI ile içerik oluşturma ve düzenleme',
      en: 'Create and edit content with ContextAI',
      de: 'Inhalte mit ContextAI erstellen und bearbeiten',
      fr: 'Créer et modifier du contenu avec ContextAI',
      es: 'Crear y editar contenido con ContextAI',
   },
   EXPORT_DOCUMENT: {
      tr: 'Doküman Dışa Aktar',
      en: 'Export Document',
      de: 'Dokument exportieren',
      fr: 'Exporter le document',
      es: 'Exportar documento',
   },
   DOCUMENT: {
      tr: 'Doküman',
      en: 'Document',
      de: 'Dokument',
      fr: 'Document',
      es: 'Documento',
   },
   FILE_NAME: {
      tr: 'Dosya Adı',
      en: 'File Name',
      de: 'Dateiname',
      fr: 'Nom du fichier',
      es: 'Nombre del archivo',
   },
   FILE_UPLOAD: {
      tr: 'Dosya Yükle',
      en: 'File Upload',
      de: 'Datei hochladen',
      fr: 'Télécharger un fichier',
      es: 'Subir archivo',
   },
   TEXT_CONTENT: {
      tr: 'Metin İçeriği',
      en: 'Text Content',
      de: 'Textinhalt',
      fr: 'Contenu textuel',
      es: 'Contenido de texto',
   },
   FROM_URL: {
      tr: "URL'den",
      en: 'From URL',
      de: 'Von URL',
      fr: 'Depuis l’URL',
      es: 'Desde URL',
   },
   UPLOAD_FILE: {
      tr: 'Dosya Yükle',
      en: 'Upload File',
      de: 'Datei hochladen',
      fr: 'Télécharger un fichier',
      es: 'Subir archivo',
   },
   SUPPORTED_FORMATS: {
      tr: 'Desteklenen Formatlar',
      en: 'Supported Formats',
      de: 'Unterstützte Formate',
      fr: 'Formats pris en charge',
      es: 'Formatos compatibles',
   },
   CHOOSE_FILE: {
      tr: 'Dosya Seç',
      en: 'Choose File',
      de: 'Datei auswählen',
      fr: 'Choisir un fichier',
      es: 'Elegir archivo',
   },
   UPLOADING: {
      tr: 'Yükleniyor...',
      en: 'Uploading...',
      de: 'Hochladen...',
      fr: 'Téléchargement en cours...',
      es: 'Subiendo...',
   },
   PROCESSING_FILE: {
      tr: 'Dosya işleniyor...',
      en: 'Processing file...',
      de: 'Datei wird verarbeitet...',
      fr: 'Traitement du fichier en cours...',
      es: 'Procesando archivo...',
   },

   // DOCX
   DOCX_IMPORT: {
      tr: 'DOCX İçe Aktar',
      en: 'Import DOCX',
      de: 'DOCX importieren',
      fr: 'Importer DOCX',
      es: 'Importar DOCX',
   },
   IMPORT_EXPORT: {
      tr: 'İçe/Dışa Aktar',
      en: 'Import/Export',
      de: 'Importieren/Exportieren',
      fr: 'Importer/Exporter',
      es: 'Importar/Exportar',
   },
   DOCX_IMPORT_DESC: {
      tr: 'DOCX dosyası yükleyerek içeriği aktarabilirsiniz.',
      en: 'You can import content by uploading a DOCX file.',
      de: 'Sie können Inhalte importieren, indem Sie eine DOCX-Datei hochladen.',
      fr: 'Vous pouvez importer du contenu en téléchargeant un fichier DOCX.',
      es: 'Puede importar contenido cargando un archivo DOCX.',
   },
   CHOOSE_DOCX_FILE: {
      tr: 'DOCX Dosyası Seç',
      en: 'Choose DOCX File',
      de: 'DOCX-Datei auswählen',
      fr: 'Choisir un fichier DOCX',
      es: 'Elegir archivo DOCX',
   },
   CONVERTING_DOCX: {
      tr: 'DOCX dönüştürülüyor...',
      en: 'Converting DOCX...',
      de: 'DOCX wird konvertiert...',
      fr: 'Conversion de DOCX en cours...',
      es: 'Convirtiendo DOCX...',
   },

   // Metin içeriği
   PASTE_CONTENT: {
      tr: 'İçeriği Yapıştır',
      en: 'Paste Content',
      de: 'Inhalt einfügen',
      fr: 'Coller le contenu',
      es: 'Pegar contenido',
   },
   PASTE_FROM_CLIPBOARD: {
      tr: 'Panodan Yapıştır',
      en: 'Paste from Clipboard',
      de: 'Aus der Zwischenablage einfügen',
      fr: 'Coller depuis le presse-papiers',
      es: 'Pegar desde el portapapeles',
   },
   PASTE_HTML_MARKDOWN_TEXT: {
      tr: 'HTML, Markdown veya düz metni buraya yapıştırın...',
      en: 'Paste HTML, Markdown, or plain text here...',
      de: 'HTML, Markdown oder einfachen Text hier einfügen...',
      fr: 'Coller HTML, Markdown ou texte brut ici...',
      es: 'Pegar HTML, Markdown o texto plano aquí...',
   },
   IMPORT_AS_HTML: {
      tr: 'HTML Olarak İçe Aktar',
      en: 'Import as HTML',
      de: 'Als HTML importieren',
      fr: 'Importer en HTML',
      es: 'Importar como HTML',
   },
   IMPORT_AS_MARKDOWN: {
      tr: 'Markdown Olarak İçe Aktar',
      en: 'Import as Markdown',
      de: 'Als Markdown importieren',
      fr: 'Importer en Markdown',
      es: 'Importar como Markdown',
   },
   IMPORT_AS_TEXT: {
      tr: 'Metin Olarak İçe Aktar',
      en: 'Import as Text',
      de: 'Als Text importieren',
      fr: 'Importer en texte',
      es: 'Importar como texto',
   },
   IMPORT_AS_JSON: {
      tr: 'JSON Olarak İçe Aktar',
      en: 'Import as JSON',
      de: 'Als JSON importieren',
      fr: 'Importer en JSON',
      es: 'Importar como JSON',
   },

   // URL ile içe aktarma
   IMPORT_DOCUMENT: {
      tr: 'Belge İçe Aktar',
      en: 'Import Document',
      de: 'Dokument importieren',
      fr: 'Importer le document',
      es: 'Importar documento',
   },
   WEBSITE_URL: {
      tr: "Web Sitesi URL'si",
      en: 'Website URL',
      de: 'Website-URL',
      fr: 'URL du site web',
      es: 'URL del sitio web',
   },
   IMPORTING: {
      tr: 'İçe aktarılıyor...',
      en: 'Importing...',
      de: 'Importieren...',
      fr: 'Importation...',
      es: 'Importando...',
   },
   IMPORT: {
      tr: 'İçe Aktar',
      en: 'Import',
      de: 'Importieren',
      fr: 'Importer',
      es: 'Importar',
   },
   IMPORT_TEXT: {
      tr: 'Metin İçe Aktar',
      en: 'Import Text',
      de: 'Text importieren',
      fr: 'Importer le texte',
      es: 'Importar texto',
   },
   IMPORT_TEXT_DESC: {
      tr: 'Metin içeriğini buraya yapıştırın veya URL girin',
      en: 'Paste text content here or enter a URL',
      de: 'Fügen Sie hier Textinhalte ein oder geben Sie eine URL ein',
      fr: 'Collez le contenu textuel ici ou entrez une URL',
      es: 'Pegue el contenido de texto aquí o ingrese una URL',
   },
   IMPORT_DOCX: {
      tr: 'DOCX İçe Aktar',
      en: 'Import DOCX',
      de: 'DOCX importieren',
      fr: 'Importer DOCX',
      es: 'Importar DOCX',
   },
   IMPORT_DOCX_DESC: {
      tr: 'DOCX dosyasını yükleyerek içeriği aktarabilirsiniz',
      en: 'You can import content by uploading a DOCX file',
      de: 'Sie können Inhalte importieren, indem Sie eine DOCX-Datei hochladen',
      fr: 'Vous pouvez importer du contenu en téléchargeant un fichier DOCX',
      es: 'Puede importar contenido cargando un archivo DOCX',
   },
   IMPORT_URL: {
      tr: 'URL İçe Aktar',
      en: 'Import from URL',
      de: 'Von URL importieren',
      fr: 'Importer depuis l’URL',
      es: 'Importar desde URL',
   },
   IMPORT_URL_DESC: {
      tr: 'Web sayfasından içerik içe aktarın',
      en: 'Import content from a web page',
      de: 'Inhalt von einer Webseite importieren',
      fr: 'Importer du contenu depuis une page web',
      es: 'Importar contenido desde una página web',
   },
   EXPORT_DOCX: {
      tr: 'DOCX Olarak Dışa Aktar',
      en: 'Export as DOCX',
      de: 'Als DOCX exportieren',
      fr: 'Exporter en DOCX',
      es: 'Exportar como DOCX',
   },
   EXPORT_DOCX_DESC: {
      tr: 'İçeriği DOCX dosyası olarak dışa aktarın',
      en: 'Export content as a DOCX file',
      de: 'Inhalt als DOCX-Datei exportieren',
      fr: 'Exporter le contenu en tant que fichier DOCX',
      es: 'Exportar contenido como archivo DOCX',
   },
   EXPORT_HTML: {
      tr: 'HTML Olarak Dışa Aktar',
      en: 'Export as HTML',
      de: 'Als HTML exportieren',
      fr: 'Exporter en HTML',
      es: 'Exportar como HTML',
   },
   EXPORT_HTML_DESC: {
      tr: 'İçeriği HTML dosyası olarak dışa aktarın',
      en: 'Export content as an HTML file',
      de: 'Inhalt als HTML-Datei exportieren',
      fr: 'Exporter le contenu en tant que fichier HTML',
      es: 'Exportar contenido como archivo HTML',
   },
   EXPORT_MARKDOWN: {
      tr: 'Markdown Olarak Dışa Aktar',
      en: 'Export as Markdown',
      de: 'Als Markdown exportieren',
      fr: 'Exporter en Markdown',
      es: 'Exportar como Markdown',
   },
   EXPORT_MARKDOWN_DESC: {
      tr: 'İçeriği Markdown dosyası olarak dışa aktarın',
      en: 'Export content as a Markdown file',
      de: 'Inhalt als Markdown-Datei exportieren',
      fr: 'Exporter le contenu en tant que fichier Markdown',
      es: 'Exportar contenido como archivo Markdown',
   },
   IMPORT_EXPORT_TIP: {
      tr: 'İçe/Dışa aktarma işlemleri için lütfen yukarıdaki seçeneklerden birini kullanın.',
      en: 'Please use one of the options above for import/export operations.',
      de: 'Bitte verwenden Sie eine der oben genannten Optionen für Import/Export-Vorgänge.',
      fr: 'Veuillez utiliser l’une des options ci-dessus pour les opérations d’import/export.',
      es: 'Por favor, utilice una de las opciones anteriores para las operaciones de importación/exportación.',
   },

   FETCHING_CONTENT: {
      tr: 'İçerik getiriliyor...',
      en: 'Fetching content...',
      de: 'Inhalt wird abgerufen...',
      fr: 'Récupération du contenu en cours...',
      es: 'Obteniendo contenido...',
   },
   SUPPORTED_SOURCES: {
      tr: 'Desteklenen Kaynaklar',
      en: 'Supported Sources',
      de: 'Unterstützte Quellen',
      fr: 'Sources prises en charge',
      es: 'Fuentes compatibles',
   },
   BLOG_ARTICLES: {
      tr: 'Blog Yazıları',
      en: 'Blog Articles',
      de: 'Blogartikel',
      fr: 'Articles de blog',
      es: 'Artículos de blog',
   },
   WIKIPEDIA_PAGES: {
      tr: 'Wikipedia Sayfaları',
      en: 'Wikipedia Pages',
      de: 'Wikipedia-Seiten',
      fr: 'Pages Wikipedia',
      es: 'Páginas de Wikipedia',
   },
   NEWS_ARTICLES: {
      tr: 'Haber Makaleleri',
      en: 'News Articles',
      de: 'Nachrichtenartikel',
      fr: 'Articles de presse',
      es: 'Artículos de noticias',
   },
   DOCUMENTATION_PAGES: {
      tr: 'Dokümantasyon Sayfaları',
      en: 'Documentation Pages',
      de: 'Dokumentationsseiten',
      fr: 'Pages de documentation',
      es: 'Páginas de documentación',
   },

   // Export işlemleri
   EXPORT: {
      tr: 'Dışa Aktar',
      en: 'Export',
      de: 'Exportieren',
      fr: 'Exporter',
      es: 'Exportar',
   },
   EXPORTING: {
      tr: 'Dışa aktarılıyor...',
      en: 'Exporting...',
      de: 'Exportieren...',
      fr: 'Exportation...',
      es: 'Exportando...',
   },
   EXPORT_JSON: {
      tr: 'JSON Olarak Dışa Aktar',
      en: 'Export as JSON',
      de: 'Als JSON exportieren',
      fr: 'Exporter en JSON',
      es: 'Exportar como JSON',
   },
   EXPORT_TEXT: {
      tr: 'Metin Olarak Dışa Aktar',
      en: 'Export as Text',
      de: 'Als Text exportieren',
      fr: 'Exporter en texte',
      es: 'Exportar como texto',
   },
   CLEAN_HTML: {
      tr: 'Temiz HTML',
      en: 'Clean HTML',
      de: 'Reines HTML',
      fr: 'HTML propre',
      es: 'HTML limpio',
   },
   CLEAN_HTML_PREVIEW: {
      tr: 'Temiz HTML Önizleme',
      en: 'Clean HTML Preview',
      de: 'Vorschau auf sauberes HTML',
      fr: 'Aperçu HTML propre',
      es: 'Vista previa de HTML limpio',
   },
   JSON_PREVIEW: {
      tr: 'JSON Önizleme',
      en: 'JSON Preview',
      de: 'JSON-Vorschau',
      fr: 'Aperçu JSON',
      es: 'Vista previa de JSON',
   },
   TEXT_PREVIEW: {
      tr: 'Metin Önizleme',
      en: 'Text Preview',
      de: 'Textvorschau',
      fr: 'Aperçu du texte',
      es: 'Vista previa de texto',
   },
   NO_NAME: {
      tr: 'İsim Yok',
      en: 'No Name',
      de: 'Kein Name',
      fr: 'Pas de nom',
      es: 'Sin nombre',
   },
   NO_IMAGE_GALLERY_URL: {
      tr: "Resim Galerisi URL'si yok",
      en: 'No Image Gallery URL',
      de: 'Keine Bildgalerie-URL',
      fr: 'Pas d’URL de galerie d’images',
      es: 'Sin URL de galería de imágenes',
   },
   DELETING: {
      tr: 'Siliniyor...',
      en: 'Deleting...',
      de: 'Löschen...',
      fr: 'Suppression en cours...',
      es: 'Eliminando...',
   },
   DELETE_SUCCESS: {
      tr: 'Başarıyla silindi',
      en: 'Deleted successfully',
      de: 'Erfolgreich gelöscht',
      fr: 'Supprimé avec succès',
      es: 'Eliminado con éxito',
   },
   DELETE_ERROR: {
      tr: 'Silme işlemi başarısız oldu',
      en: 'Delete operation failed',
      de: 'Löschvorgang fehlgeschlagen',
      fr: 'Échec de la suppression',
      es: 'Error al eliminar',
   },
   CONFIRM_DELETE_TITLE: {
      tr: 'Silme Onayı',
      en: 'Confirm Delete',
      de: 'Löschen bestätigen',
      fr: 'Confirmer la suppression',
      es: 'Confirmar eliminación',
   },
   CONFIRM_DELETE_DESC: {
      tr: 'Bu öğeyi silmek istediğinizden emin misiniz?',
      en: 'Are you sure you want to delete this item?',
      de: 'Sind Sie sicher, dass Sie dieses Element löschen möchten?',
      fr: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
      es: '¿Estás seguro de que quieres eliminar este elemento?',
   },
   CONFIRM: {
      tr: 'Onayla',
      en: 'Confirm',
      de: 'Bestätigen',
      fr: 'Confirmer',
      es: 'Confirmar',
   },
   SAVING: {
      tr: 'Kaydediliyor...',
      en: 'Saving...',
      de: 'Speichern...',
      fr: 'Enregistrement...',
      es: 'Guardando...',
   },
   UPDATING: {
      tr: 'Güncelleniyor...',
      en: 'Updating...',
      de: 'Aktualisieren...',
      fr: 'Mise à jour...',
      es: 'Actualizando...',
   },
   ERROR: {
      tr: 'Bir hata oluştu',
      en: 'An error occurred',
      de: 'Ein Fehler ist aufgetreten',
      fr: 'Une erreur est survenue',
      es: 'Ocurrió un error',
   },
   EDIT: {
      tr: 'Düzenle',
      en: 'Edit',
      de: 'Bearbeiten',
      fr: 'Modifier',
      es: 'Editar',
   },
   NAME: {
      tr: 'İsim',
      en: 'Name',
      de: 'Name',
      fr: 'Nom',
      es: 'Nombre',
   },
   STATUS: {
      tr: 'Durum',
      en: 'Status',
      de: 'Status',
      fr: 'Statut',
      es: 'Estado',
   },
   TYPE: {
      tr: 'Tür',
      en: 'Type',
      de: 'Typ',
      fr: 'Type',
      es: 'Tipo',
   },
   SIZE: {
      tr: 'Boyut',
      en: 'Size',
      de: 'Größe',
      fr: 'Taille',
      es: 'Tamaño',
   },
   WIDTH: {
      tr: 'Genişlik',
      en: 'Width',
      de: 'Breite',
      fr: 'Largeur',
      es: 'Ancho',
   },
   HEIGHT: {
      tr: 'Yükseklik',
      en: 'Height',
      de: 'Höhe',
      fr: 'Hauteur',
      es: 'Altura',
   },
   PATH: {
      tr: 'Yol',
      en: 'Path',
      de: 'Pfad',
      fr: 'Chemin',
      es: 'Ruta',
   },
   URL: {
      tr: 'URL',
      en: 'URL',
      de: 'URL',
      fr: 'URL',
      es: 'URL',
   },
   SAVE: {
      tr: 'Kaydet',
      en: 'Save',
      de: 'Speichern',
      fr: 'Enregistrer',
      es: 'Guardar',
   },
   DONE: {
      tr: 'Tamam',
      en: 'Done',
      de: 'Fertig',
      fr: 'Terminé',
      es: 'Hecho',
   },
   NO_DATA: {
      tr: 'Gösterilecek veri yok',
      en: 'No data to show',
      de: 'Keine Daten zum Anzeigen',
      fr: 'Aucune donnée à afficher',
      es: 'No hay datos para mostrar',
   },
   SELECT_IMAGE_FROM_GALLERY: {
      tr: 'Galeriden Resim Seç',
      en: 'Select Image from Gallery',
      de: 'Bild aus Galerie auswählen',
      fr: 'Sélectionner une image dans la galerie',
      es: 'Seleccionar imagen de la galería',
   },
   SELECT_IMAGE_FROM_GALLERY_DESCRIPTION: {
      tr: 'Resim galerinizden bir resim seçin',
      en: 'Select an image from your image gallery',
      de: 'Wählen Sie ein Bild aus Ihrer Bildergalerie aus',
      fr: 'Sélectionnez une image dans votre galerie d’images',
      es: 'Selecciona una imagen de tu galería de imágenes',
   },
   NO_IMAGES: {
      tr: 'Galeri içinde resim yok',
      en: 'No images in gallery',
      de: 'Keine Bilder in der Galerie',
      fr: 'Aucune image dans la galerie',
      es: 'No hay imágenes en la galería',
   },
   CANCEL: {
      tr: 'İptal',
      en: 'Cancel',
      de: 'Abbrechen',
      fr: 'Annuler',
      es: 'Cancelar',
   },
   INSERT: {
      tr: 'Ekle',
      en: 'Insert',
      de: 'Einfügen',
      fr: 'Insérer',
      es: 'Insertar',
   },
   API_NOT_CONFIGURED: {
      tr: 'API yapılandırılmamış',
      en: 'API not configured',
      de: 'API nicht konfiguriert',
      fr: 'API non configurée',
      es: 'API no configurada',
   },
   ADD_IMAGE: {
      tr: 'Resim Ekle',
      en: 'Add Image',
      de: 'Bild hinzufügen',
      fr: 'Ajouter une image',
      es: 'Agregar imagen',
   },
   UPLOAD_FROM_DEVICE: {
      tr: 'Cihazdan Yükle',
      en: 'Upload from Device',
      de: 'Vom Gerät hochladen',
      fr: 'Télécharger depuis l’appareil',
      es: 'Subir desde el dispositivo',
   },
   CHOOSE_FROM_GALLERY: {
      tr: 'Galeriden Seç',
      en: 'Choose from Gallery',
      de: 'Aus Galerie auswählen',
      fr: 'Choisir dans la galerie',
      es: 'Elegir de la galería',
   },
   ADD_FROM_URL: {
      tr: 'URL’den Ekle',
      en: 'Add from URL',
      de: 'Von URL hinzufügen',
      fr: 'Ajouter depuis l’URL',
      es: 'Agregar desde URL',
   },
   FILE_SIZE_EXCEEDS: {
      tr: 'Dosya boyutu izin verilen maksimum değeri aşıyor ({maxSizeMB}MB)',
      en: 'File size exceeds maximum allowed ({maxSizeMB}MB)',
      de: 'Dateigröße überschreitet das zulässige Maximum ({maxSizeMB}MB)',
      fr: 'La taille du fichier dépasse le maximum autorisé ({maxSizeMB}MB)',
      es: 'El tamaño del archivo excede el máximo permitido ({maxSizeMB}MB)',
   },
   NO_FILE_SELECTED: {
      tr: 'Dosya seçilmedi',
      en: 'No file selected',
      de: 'Keine Datei ausgewählt',
      fr: 'Aucun fichier sélectionné',
      es: 'Ningún archivo seleccionado',
   },
   NO_FILES_TO_UPLOAD: {
      tr: 'Yüklenecek dosya yok',
      en: 'No files to upload',
      de: 'Keine Dateien zum Hochladen',
      fr: 'Aucun fichier à télécharger',
      es: 'No hay archivos para cargar',
   },
   MAXIMUM_FILES_ALLOWED: {
      tr: 'En fazla {limit} dosya yüklenebilir',
      en: 'Maximum {limit} file{plural} allowed',
      de: 'Maximal {limit} Datei(en) erlaubt',
      fr: 'Maximum {limit} fichier(s) autorisé(s)',
      es: 'Máximo {limit} archivo(s) permitido(s)',
   },
   FILE_IS_UNDEFINED: {
      tr: 'Dosya tanımsız',
      en: 'File is undefined',
      de: 'Datei ist undefiniert',
      fr: 'Le fichier est indéfini',
      es: 'El archivo está indefinido',
   },
   UPLOAD_FAILED: {
      tr: 'Yükleme başarısız oldu',
      en: 'Upload failed',
      de: 'Upload fehlgeschlagen',
      fr: 'Échec du téléchargement',
      es: 'Error de carga',
   },
   UPLOAD_FUNCTION_NOT_DEFINED: {
      tr: 'Yükleme fonksiyonu tanımlı değil',
      en: 'Upload function is not defined',
      de: 'Upload-Funktion ist nicht definiert',
      fr: 'La fonction de téléchargement n’est pas définie',
      es: 'La función de carga no está definida',
   },
   UPLOAD_FAILED_NO_URL: {
      tr: 'Yükleme başarısız: URL dönmedi',
      en: 'Upload failed: No URL returned',
      de: 'Upload fehlgeschlagen: Keine URL zurückgegeben',
      fr: 'Échec du téléchargement : aucune URL renvoyée',
      es: 'Error de carga: no se devolvió URL',
   },
   COULD_NOT_DETERMINE_POSITION: {
      tr: 'Resim yükleme için pozisyon belirlenemedi.',
      en: 'Could not determine position for image upload.',
      de: 'Position für den Bild-Upload konnte nicht bestimmt werden.',
      fr: 'Impossible de déterminer la position pour le téléchargement de l’image.',
      es: 'No se pudo determinar la posición para la carga de la imagen.',
   },
   CLICK_TO_UPLOAD: {
      tr: 'Yüklemek için tıklayın',
      en: 'Click to upload',
      de: 'Zum Hochladen klicken',
      fr: 'Cliquez pour télécharger',
      es: 'Haga clic para cargar',
   },
   OR_DRAG_AND_DROP: {
      tr: 'veya sürükleyip bırakın',
      en: 'or drag and drop',
      de: 'oder ziehen und ablegen',
      fr: 'ou faites glisser et déposez',
      es: 'o arrastre y suelte',
   },
   MAXIMUM_FILE_SIZE: {
      tr: 'Maksimum dosya boyutu {maxSizeMB}MB.',
      en: 'Maximum file size {maxSizeMB}MB.',
      de: 'Maximale Dateigröße {maxSizeMB}MB.',
      fr: 'Taille maximale du fichier {maxSizeMB}MB.',
      es: 'Tamaño máximo del archivo {maxSizeMB}MB.',
   },
   SUCCESS: {
      tr: 'Başarılı',
      en: 'Success',
      de: 'Erfolg',
      fr: 'Succès',
      es: 'Éxito',
   },
   REMOVE: {
      tr: 'Kaldır',
      en: 'Remove',
      de: 'Entfernen',
      fr: 'Supprimer',
      es: 'Eliminar',
   },
   INVALID_IMAGE_URL: {
      tr: "Geçerli bir resim URL'si girin! (jpg, jpeg, png, gif, webp, svg)",
      en: 'Please enter a valid image URL! (jpg, jpeg, png, gif, webp, svg)',
      de: 'Bitte geben Sie eine gültige Bild-URL ein! (jpg, jpeg, png, gif, webp, svg)',
      fr: 'Veuillez entrer une URL d’image valide ! (jpg, jpeg, png, gif, webp, svg)',
      es: '¡Por favor, ingrese una URL de imagen válida! (jpg, jpeg, png, gif, webp, svg)',
   },
   EXTENSION_NOT_FOUND: {
      tr: 'Resim eklentisi bulunamadı veya doğru yapılandırılmadı.',
      en: 'Image extension not found or not configured properly.',
      de: 'Bildungserweiterung nicht gefunden oder nicht richtig konfiguriert.',
      fr: 'Extension d’image non trouvée ou mal configurée.',
      es: 'Extensión de imagen no encontrada o no configurada correctamente.',
   },
   ENTER_VALID_URL: {
      tr: 'Lütfen geçerli bir resim URL girin.',
      en: 'Please enter a valid image URL.',
      de: 'Bitte geben Sie eine gültige Bild-URL ein.',
      fr: 'Veuillez entrer une URL d’image valide.',
      es: 'Por favor, ingrese una URL de imagen válida.',
   },
   SELECTED: {
      tr: 'Seçildi',
      en: 'Selected',
      de: 'Ausgewählt',
      fr: 'Sélectionné',
      es: 'Seleccionado',
   },
   ALIGN_LEFT: {
      tr: 'Sola Hizala',
      en: 'Align Left',
      de: 'Links ausrichten',
      fr: 'Aligner à gauche',
      es: 'Alinear a la izquierda',
   },
   ALIGN_CENTER: {
      tr: 'Ortala',
      en: 'Align Center',
      de: 'Zentrieren',
      fr: 'Centrer',
      es: 'Centrar',
   },
   ALIGN_RIGHT: {
      tr: 'Sağa Hizala',
      en: 'Align Right',
      de: 'Rechts ausrichten',
      fr: 'Aligner à droite',
      es: 'Alinear a la derecha',
   },
   ALIGN_JUSTIFY: {
      tr: 'İki Kenar Hizala',
      en: 'Justify',
      de: 'Blocksatz',
      fr: 'Justifier',
      es: 'Justificar',
   },
   DEFAULT: {
      tr: 'Varsayılan',
      en: 'Default',
      de: 'Standard',
      fr: 'Par défaut',
      es: 'Predeterminado',
   },
   PURPLE: {
      tr: 'Mor',
      en: 'Purple',
      de: 'Lila',
      fr: 'Violet',
      es: 'Morado',
   },
   RED: {
      tr: 'Kırmızı',
      en: 'Red',
      de: 'Rot',
      fr: 'Rouge',
      es: 'Rojo',
   },
   YELLOW: {
      tr: 'Sarı',
      en: 'Yellow',
      de: 'Gelb',
      fr: 'Jaune',
      es: 'Amarillo',
   },
   BLUE: {
      tr: 'Mavi',
      en: 'Blue',
      de: 'Blau',
      fr: 'Bleu',
      es: 'Azul',
   },
   GREEN: {
      tr: 'Yeşil',
      en: 'Green',
      de: 'Grün',
      fr: 'Vert',
      es: 'Verde',
   },
   ORANGE: {
      tr: 'Turuncu',
      en: 'Orange',
      de: 'Orange',
      fr: 'Orange',
      es: 'Naranja',
   },
   PINK: {
      tr: 'Pembe',
      en: 'Pink',
      de: 'Rosa',
      fr: 'Rose',
      es: 'Rosa',
   },
   GRAY: {
      tr: 'Gri',
      en: 'Gray',
      de: 'Grau',
      fr: 'Gris',
      es: 'Gris',
   },
   UNSETFONTFAMILY: {
      tr: 'Yazı Tipi Yok',
      en: 'No Font',
      de: 'Keine Schrift',
      fr: 'Aucune police',
      es: 'Sin fuente',
   },
   PARAGRAPH: {
      tr: 'Paragraf',
      en: 'Paragraph',
      de: 'Absatz',
      fr: 'Paragraphe',
      es: 'Párrafo',
   },
   FONTSIZE_RANGE_ERROR: {
      tr: 'Font boyutu 8px ile 200px arasında olmalıdır',
      en: 'Font size must be between 8px and 200px',
      de: 'Die Schriftgröße muss zwischen 8px und 200px liegen',
      fr: 'La taille de police doit être comprise entre 8px et 200px',
      es: 'El tamaño de fuente debe estar entre 8px y 200px',
   },
   CUSTOM_SIZE: {
      tr: 'Özel Boyut',
      en: 'Custom Size',
      de: 'Benutzerdefinierte Größe',
      fr: 'Taille personnalisée',
      es: 'Tamaño personalizado',
   },
   FONTSIZE_HELP_HEADING: {
      tr: 'Normal text için yukarıdaki "Paragraf" seçeneğini tıklayın.',
      en: 'Click the "Paragraph" option above for normal text.',
      de: 'Klicken Sie oben auf "Absatz" für normalen Text.',
      fr: 'Cliquez sur l\'option "Paragraphe" ci-dessus pour le texte normal.',
      es: 'Haz clic en la opción "Párrafo" de arriba para texto normal.',
   },
   FONTSIZE_HELP_ENTER: {
      tr: 'Enter tuşu ile hızlı uygulama yapabilirsiniz',
      en: 'You can quickly apply with the Enter key',
      de: 'Sie können mit der Eingabetaste schnell anwenden',
      fr: 'Vous pouvez appliquer rapidement avec la touche Entrée',
      es: 'Puedes aplicar rápidamente con la tecla Enter',
   },
   CLEAR_ALL: {
      tr: 'Tümünü Temizle',
      en: 'Clear All',
      de: 'Alles löschen',
      fr: 'Tout effacer',
      es: 'Borrar todo',
   },
   LINEHEIGHT_HELP: {
      tr: 'İpucu: Enter tuşu ile hızlı uygulama yapabilirsiniz. Değer aralığı: 0.5 - 5.0',
      en: 'Tip: You can quickly apply with the Enter key. Value range: 0.5 - 5.0',
      de: 'Tipp: Mit der Eingabetaste können Sie schnell anwenden. Wertebereich: 0.5 - 5.0',
      fr: 'Astuce : Vous pouvez appliquer rapidement avec la touche Entrée. Plage de valeurs : 0.5 - 5.0',
      es: 'Consejo: Puedes aplicar rápidamente con la tecla Enter. Rango de valores: 0.5 - 5.0',
   },
   LINE_HEIGHT: {
      tr: 'Satır Yüksekliği',
      en: 'Line Height',
      de: 'Zeilenhöhe',
      fr: 'Hauteur de ligne',
      es: 'Altura de línea',
   },
   CURRENT_LINE_HEIGHT: {
      tr: 'Geçerli Satır Yüksekliği',
      en: 'Current Line Height',
      de: 'Aktuelle Zeilenhöhe',
      fr: 'Hauteur de ligne actuelle',
      es: 'Altura de línea actual',
   },
   CUSTOM_LINE_HEIGHT: {
      tr: 'Özel Satır Yüksekliği',
      en: 'Custom Line Height',
      de: 'Benutzerdefinierte Zeilenhöhe',
      fr: 'Hauteur de ligne personnalisée',
      es: 'Altura de línea personalizada',
   },
   QUICK_PRESETS: {
      tr: 'Hızlı Ön Ayarlar',
      en: 'Quick Presets',
      de: 'Schnelle Voreinstellungen',
      fr: 'Préréglages rapides',
      es: 'Ajustes rápidos',
   },
   LINEHEIGHT_RANGE_ERROR: {
      tr: 'Satır yüksekliği 0.5 ile 5.0 arasında olmalıdır',
      en: 'Line height must be between 0.5 and 5.0',
      de: 'Der Zeilenabstand muss zwischen 0.5 und 5.0 liegen',
      fr: 'La hauteur de ligne doit être comprise entre 0.5 et 5.0',
      es: 'La altura de línea debe estar entre 0.5 y 5.0',
   },
   LINK_ERROR_PROTOCOL_NOT_ALLOWED: {
      tr: '{protocol} protokolüne izin verilmiyor',
      en: '{protocol} protocol is not allowed',
      de: '{protocol} Protokoll ist nicht erlaubt',
      fr: "Le protocole {protocol} n'est pas autorisé",
      es: 'El protocolo {protocol} no está permitido',
   },
   LINK_ERROR_ONLY_HTTP_HTTPS: {
      tr: 'Sadece HTTP ve HTTPS protokollerine izin veriliyor',
      en: 'Only HTTP and HTTPS protocols are allowed',
      de: 'Nur HTTP- und HTTPS-Protokolle sind erlaubt',
      fr: 'Seuls les protocoles HTTP et HTTPS sont autorisés',
      es: 'Solo se permiten los protocolos HTTP y HTTPS',
   },
   LINK_ERROR_BLOCKED_DOMAIN: {
      tr: 'Bu domain güvenlik nedeniyle engellendi: {domain}',
      en: 'This domain is blocked for security reasons: {domain}',
      de: 'Diese Domain wurde aus Sicherheitsgründen blockiert: {domain}',
      fr: 'Ce domaine est bloqué pour des raisons de sécurité : {domain}',
      es: 'Este dominio está bloqueado por razones de seguridad: {domain}',
   },
   LINK_ERROR_SUSPICIOUS_DOMAIN: {
      tr: 'Şüpheli domain tespit edildi: {domain}',
      en: 'Suspicious domain detected: {domain}',
      de: 'Verdächtige Domain erkannt: {domain}',
      fr: 'Domaine suspect détecté : {domain}',
      es: 'Dominio sospechoso detectado: {domain}',
   },
   LINK_ERROR_IP_NOT_ALLOWED: {
      tr: 'IP adresi linklerine izin verilmiyor',
      en: 'IP address links are not allowed',
      de: 'IP-Adresslinks sind nicht erlaubt',
      fr: "Les liens d'adresse IP ne sont pas autorisés",
      es: 'No se permiten enlaces de direcciones IP',
   },
   LINK_ERROR_INVALID_FORMAT: {
      tr: 'Geçersiz URL formatı',
      en: 'Invalid URL format',
      de: 'Ungültiges URL-Format',
      fr: "Format d'URL invalide",
      es: 'Formato de URL no válido',
   },
   LINK_SELECTOR_PLACEHOLDER_SELECTED: {
      tr: 'URL girin (seçili metin link olacak)',
      en: 'Enter URL (selected text will become a link)',
      de: 'URL eingeben (ausgewählter Text wird zum Link)',
      fr: "Entrez l'URL (le texte sélectionné deviendra un lien)",
      es: 'Introduce la URL (el texto seleccionado será un enlace)',
   },
   LINK_SELECTOR_PLACEHOLDER_UNSELECTED: {
      tr: 'URL girin (metin olarak eklenecek)',
      en: 'Enter URL (will be added as text)',
      de: 'URL eingeben (wird als Text hinzugefügt)',
      fr: "Entrez l'URL (sera ajouté comme texte)",
      es: 'Introduce la URL (se añadirá como texto)',
   },
   LINK_SELECTOR_VALIDATING: {
      tr: 'Kontrol ediliyor...',
      en: 'Validating...',
      de: 'Wird überprüft...',
      fr: 'Validation en cours...',
      es: 'Validando...',
   },
   LINK_SELECTOR_PREVIEW_LABEL: {
      tr: 'Metin olarak eklenecek:',
      en: 'Will be added as text:',
      de: 'Wird als Text hinzugefügt:',
      fr: 'Sera ajouté comme texte :',
      es: 'Se añadirá como texto:',
   },
   CURRENT_LINK: {
      tr: 'Mevcut link',
      en: 'Current link',
      de: 'Aktueller Link',
      fr: 'Lien actuel',
      es: 'Enlace actual',
   },
   SAME_TAB: {
      tr: 'Aynı sekme',
      en: 'Same tab',
      de: 'Gleiches Tab',
      fr: 'Même onglet',
      es: 'Misma pestaña',
   },
   NEW_TAB: {
      tr: 'Yeni sekme',
      en: 'New tab',
      de: 'Neues Tab',
      fr: 'Nouvel onglet',
      es: 'Nueva pestaña',
   },
   LINK_SELECTOR_SELECTED_TEXT_LABEL: {
      tr: 'Seçili metin:',
      en: 'Selected text:',
      de: 'Ausgewählter Text:',
      fr: 'Texte sélectionné :',
      es: 'Texto seleccionado:',
   },
   LINK_SELECTOR_REMOVE: {
      tr: 'Linki kaldır',
      en: 'Remove link',
      de: 'Link entfernen',
      fr: 'Supprimer le lien',
      es: 'Eliminar enlace',
   },
   INSERT_TABLE: {
      tr: 'Tablo Ekle',
      en: 'Insert Table',
      de: 'Tabelle einfügen',
      fr: 'Insérer un tableau',
      es: 'Insertar tabla',
   },
   SELECT_TABLE_SIZE: {
      tr: 'Tablo boyutunu seçin',
      en: 'Select table size',
      de: 'Tabellengröße wählen',
      fr: 'Sélectionnez la taille du tableau',
      es: 'Selecciona el tamaño de la tabla',
   },
   TABLE_ACTIONS: {
      tr: 'Tablo İşlemleri',
      en: 'Table Actions',
      de: 'Tabellenaktionen',
      fr: 'Actions sur le tableau',
      es: 'Acciones de tabla',
   },
   ADD_COLUMN_BEFORE: {
      tr: 'Sola sütun ekle',
      en: 'Add column before',
      de: 'Spalte davor einfügen',
      fr: 'Ajouter une colonne avant',
      es: 'Agregar columna antes',
   },
   ADD_COLUMN_AFTER: {
      tr: 'Sağa sütun ekle',
      en: 'Add column after',
      de: 'Spalte danach einfügen',
      fr: 'Ajouter une colonne après',
      es: 'Agregar columna después',
   },
   DELETE_COLUMN: {
      tr: 'Sütunu sil',
      en: 'Delete column',
      de: 'Spalte löschen',
      fr: 'Supprimer la colonne',
      es: 'Eliminar columna',
   },
   ADD_ROW_BEFORE: {
      tr: 'Yukarıya satır ekle',
      en: 'Add row before',
      de: 'Zeile davor einfügen',
      fr: 'Ajouter une ligne avant',
      es: 'Agregar fila antes',
   },
   ADD_ROW_AFTER: {
      tr: 'Aşağıya satır ekle',
      en: 'Add row after',
      de: 'Zeile danach einfügen',
      fr: 'Ajouter une ligne après',
      es: 'Agregar fila después',
   },
   DELETE_ROW: {
      tr: 'Satırı sil',
      en: 'Delete row',
      de: 'Zeile löschen',
      fr: 'Supprimer la ligne',
      es: 'Eliminar fila',
   },
   MERGE_CELLS: {
      tr: 'Hücreleri birleştir',
      en: 'Merge cells',
      de: 'Zellen zusammenführen',
      fr: 'Fusionner les cellules',
      es: 'Combinar celdas',
   },
   SPLIT_CELL: {
      tr: 'Hücreyi böl',
      en: 'Split cell',
      de: 'Zelle teilen',
      fr: 'Diviser la cellule',
      es: 'Dividir celda',
   },
   TOGGLE_HEADER_ROW: {
      tr: 'Başlık satırını aç/kapat',
      en: 'Toggle header row',
      de: 'Kopfzeile umschalten',
      fr: "Afficher/masquer la ligne d'en-tête",
      es: 'Alternar fila de encabezado',
   },
   TOGGLE_HEADER_COLUMN: {
      tr: 'Başlık sütununu aç/kapat',
      en: 'Toggle header column',
      de: 'Kopfspalte umschalten',
      fr: "Afficher/masquer la colonne d'en-tête",
      es: 'Alternar columna de encabezado',
   },
   TABLE_OPTIONS: {
      tr: 'Tablo Seçenekleri',
      en: 'Table Options',
      de: 'Tabellenoptionen',
      fr: 'Options du tableau',
      es: 'Opciones de tabla',
   },
   FIX_TABLE: {
      tr: 'Tabloyu düzelt',
      en: 'Fix table',
      de: 'Tabelle reparieren',
      fr: 'Réparer le tableau',
      es: 'Arreglar tabla',
   },
   ROWS: {
      tr: 'Satırlar',
      en: 'Rows',
      de: 'Zeilen',
      fr: 'Lignes',
      es: 'Filas',
   },
   DELETE: {
      tr: 'Sil',
      en: 'Delete',
      de: 'Löschen',
      fr: 'Supprimer',
      es: 'Eliminar',
   },
   TWITTER_ADD_POST: {
      tr: 'Twitter/X Gönderisi Ekle',
      en: 'Add Twitter/X Post',
      de: 'Twitter/X Beitrag hinzufügen',
      fr: 'Ajouter un post Twitter/X',
      es: 'Agregar publicación de Twitter/X',
   },
   TWITTER_DIALOG_DESC: {
      tr: "Twitter veya X gönderisini eklemek için tweet URL'sini yapıştırın.",
      en: 'Paste the tweet URL to add a Twitter or X post.',
      de: 'Fügen Sie die Tweet-URL ein, um einen Twitter- oder X-Beitrag hinzuzufügen.',
      fr: "Collez l'URL du tweet pour ajouter un post Twitter ou X.",
      es: 'Pega la URL del tweet para agregar una publicación de Twitter o X.',
   },
   TWITTER_URL_LABEL: {
      tr: 'Tweet URL',
      en: 'Tweet URL',
      de: 'Tweet-URL',
      fr: 'URL du tweet',
      es: 'URL del tweet',
   },
   TWITTER_URL_PLACEHOLDER: {
      tr: 'https://x.com/kullanici/status/1234567890',
      en: 'https://x.com/username/status/1234567890',
      de: 'https://x.com/benutzer/status/1234567890',
      fr: 'https://x.com/utilisateur/status/1234567890',
      es: 'https://x.com/usuario/status/1234567890',
   },
   TWITTER_URL_FORMATS: {
      tr: 'Desteklenen formatlar: twitter.com, x.com',
      en: 'Supported formats: twitter.com, x.com',
      de: 'Unterstützte Formate: twitter.com, x.com',
      fr: 'Formats pris en charge : twitter.com, x.com',
      es: 'Formatos soportados: twitter.com, x.com',
   },
   TWITTER_CANCEL: {
      tr: 'İptal',
      en: 'Cancel',
      de: 'Abbrechen',
      fr: 'Annuler',
      es: 'Cancelar',
   },
   TWITTER_ADD_BUTTON: {
      tr: 'Tweet Ekle',
      en: 'Add Tweet',
      de: 'Tweet hinzufügen',
      fr: 'Ajouter le tweet',
      es: 'Agregar tweet',
   },
   YOUTUBE_ADD_VIDEO: {
      tr: 'YouTube Video Ekle',
      en: 'Add YouTube Video',
      de: 'YouTube-Video hinzufügen',
      fr: 'Ajouter une vidéo YouTube',
      es: 'Agregar video de YouTube',
   },
   YOUTUBE_URL_PLACEHOLDER: {
      tr: 'https://www.youtube.com/watch?v=...',
      en: 'https://www.youtube.com/watch?v=...',
      de: 'https://www.youtube.com/watch?v=...',
      fr: 'https://www.youtube.com/watch?v=...',
      es: 'https://www.youtube.com/watch?v=...',
   },
   TWITTER_INVALID_URL: {
      tr: 'Geçersiz Twitter/X URL',
      en: 'Invalid Twitter/X URL',
      de: 'Ungültige Twitter/X-URL',
      fr: 'URL Twitter/X invalide',
      es: 'URL de Twitter/X no válida',
   },
   YOUTUBE_UPDATE_VIDEO: {
      tr: 'Videoyu Güncelle',
      en: 'Update Video',
      de: 'Video aktualisieren',
      fr: 'Mettre à jour la vidéo',
      es: 'Actualizar video',
   },
   YOUTUBE_REMOVE_VIDEO: {
      tr: 'Videoyu kaldır',
      en: 'Remove video',
      de: 'Video entfernen',
      fr: 'Supprimer la vidéo',
      es: 'Eliminar video',
   },
   YOUTUBE_URL_LABEL: {
      tr: 'YouTube URL',
      en: 'YouTube URL',
      de: 'YouTube-URL',
      fr: 'URL YouTube',
      es: 'URL de YouTube',
   },

   YOUTUBE_INVALID_URL: {
      tr: 'Geçersiz YouTube URL',
      en: 'Invalid YouTube URL',
      de: 'Ungültige YouTube-URL',
      fr: 'URL YouTube invalide',
      es: 'URL de YouTube no válida',
   },
   URL_REQUIRED: {
      tr: 'URL gerekli',
      en: 'URL is required',
      de: 'URL ist erforderlich',
      fr: "L'URL est requise",
      es: 'Se requiere URL',
   },
   CLEAR: {
      tr: 'Temizle',
      en: 'Clear',
      de: 'Löschen',
      fr: 'Effacer',
      es: 'Limpiar',
   },
   WORD: {
      tr: 'Kelime',
      en: 'Word',
      de: 'Wort',
      fr: 'Mot',
      es: 'Palabra',
   },
   WORDS: {
      tr: 'Kelime',
      en: 'Words',
      de: 'Wörter',
      fr: 'Mots',
      es: 'Palabras',
   },
   SAVED: {
      tr: 'Kaydedildi',
      en: 'Saved',
      de: 'Gespeichert',
      fr: 'Enregistré',
      es: 'Guardado',
   },
   CLEARED: {
      tr: 'Temizlendi',
      en: 'Cleared',
      de: 'Gereinigt',
      fr: 'Effacé',
      es: 'Limpiado',
   },
   UNSAVED: {
      tr: 'Kaydedilmemiş',
      en: 'Unsaved',
      de: 'Nicht gespeichert',
      fr: 'Non enregistré',
      es: 'No guardado',
   },
};

/**
 * Internationalization class for managing language and translations.
 */
class I18n {
   /**
    * Current language code.
    * @private
    */
   private currentLanguage: Language = 'tr';

   /**
    * Sets the current language.
    * @param lang - Language code to set (e.g. 'en', 'tr').
    */
   setLanguage(lang: Language) {
      this.currentLanguage = lang;
   }

   /**
    * Gets the current language code.
    * @returns Current language code.
    */
   getCurrentLanguage(): Language {
      return this.currentLanguage;
   }

   /**
    * Returns the translation for a given key in the current language.
    * Falls back to English or the key itself if not found.
    * @param key - Translation key.
    * @param fallback - Optional fallback string.
    * @returns Translated string.
    */
   t(key: string, fallback?: string): string {
      const translation = translations[key];
      if (!translation) {
         return fallback || key;
      }
      return translation[this.currentLanguage] || translation['en'] || fallback || key;
   }

   /**
    * Returns all translations for a key as lowercase search terms.
    * Useful for multi-language search/filter.
    * @param key - Translation key.
    * @returns Array of search terms in all supported languages.
    */
   getSearchTerms(key: string): string[] {
      const translation = translations[key];
      if (!translation) return [];
      return Object.values(translation).map((term) => term.toLowerCase());
   }
}

/**
 * Singleton instance of the i18n class.
 */
export const i18n = new I18n();
export type { Language };
