import { Config } from '@remotion/cli/config';

// Export cible : 9:16 1080x1920 @60 fps — H.264, qualité constante.
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(16);

// Le sound design empile plusieurs SFX (nappe + clics + whoosh) : on relève la
// limite de balises <audio> partagées pour éviter tout avertissement en Studio.
Config.setNumberOfSharedAudioTags(24);

// La concurrence est laissée à l'auto-détection de Remotion (nombre de cœurs de la machine).
