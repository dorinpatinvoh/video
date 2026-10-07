#include <stdint.h>
/* Stubs minimaux NSS/NSPR pour Chromium headless — rendu local, aucun TLS requis. */
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <malloc.h>
#include <pthread.h>

typedef int PRBool; typedef int32_t PRInt32; typedef uint32_t PRUint32;
typedef uint64_t PRUint64; typedef void* PRFileDesc; typedef void* PRLock;
typedef int SECStatus; typedef unsigned char PRUint8;

typedef struct { int type; unsigned char *data; unsigned int len; } SECItem;
typedef struct { SECItem *arena; unsigned char *data; unsigned int len; unsigned int type; } SECItemReal;

/* ---- NSPR ---- */
void PR_Init(int a, int b, int c) { (void)a;(void)b;(void)c; }
PRUint64 PR_Now(void) { struct timespec ts; clock_gettime(CLOCK_REALTIME, &ts);
  return (PRUint64)ts.tv_sec * 1000000ULL + ts.tv_nsec / 1000; }
PRInt32 PR_GetError(void) { return 0; }
PRInt32 PR_GetOSError(void) { return 0; }
const char *PR_GetErrorText(void) { return ""; }
PRInt32 PR_GetErrorTextLength(void) { return 0; }

/* ---- NSS core ---- */
PRBool NSS_VersionCheck(const char *v) { (void)v; return 1; }
SECStatus NSS_NoDB_Init(const char *dir) { (void)dir; return 0; }
SECStatus NSS_InitReadWrite(const char *dir) { (void)dir; return 0; }
SECStatus NSS_SetAlgorithmPolicy(unsigned int a, unsigned int b, unsigned int c) { (void)a;(void)b;(void)c; return 0; }
int NSS_IsInitialized(void) { return 1; }

/* ---- SECITEM ---- */
SECItem *SECITEM_AllocItem(void *arena, SECItem *item, unsigned int len) {
  (void)arena;
  SECItemReal *r = calloc(1, sizeof(SECItemReal));
  r->data = len ? malloc(len) : NULL;
  r->len = len;
  if (item) { *(SECItemReal *)item = *r; free(r); return item; }
  return (SECItem *)r;
}
void SECITEM_FreeItem(SECItem *zap, PRBool freeit) {
  if (!zap) return;
  free(zap->data);
  if (freeit) free(zap);
}

/* ---- CERT ---- */
void *CERT_GetDefaultCertDB(void) { return NULL; }
void *CERT_CreateSubjectCertList(void *l, void *db, SECItem *n, int64_t t, PRBool ok) {
  (void)l;(void)db;(void)n;(void)t;(void)ok; return NULL; }
void CERT_DestroyCertList(void *l) { (void)l; }
void CERT_DestroyCertificate(void *c) { (void)c; }
void *CERT_DupCertificate(void *c) { return c; }
void *CERT_FindCertByDERCert(void *db, SECItem *d) { (void)db;(void)d; return NULL; }
SECStatus CERT_GetCertTrust(void *c, void *t) { (void)c;(void)t; return -1; }
PRBool CERT_IsUserCert(void *c) { (void)c; return 0; }

/* ---- PK11 ---- */
void *PK11_GetInternalKeySlot(void) { return NULL; }
void *PK11_ReferenceSlot(void *s) { return s; }
void PK11_FreeSlot(void *s) { (void)s; }
char *PK11_GetTokenName(void *s) { (void)s; return (char *)""; }
PRBool PK11_IsPresent(void *s) { (void)s; return 0; }
PRBool PK11_HasRootCerts(void *s) { (void)s; return 0; }
void *PK11_GetModule(void *s) { (void)s; return NULL; }
void *PK11_FindCertInSlot(void *s, void *c, void *w) { (void)s;(void)c;(void)w; return NULL; }
void *PK11_ListCerts(int t, void *w) { (void)t;(void)w; return NULL; }
void *PK11_ListCertsInSlot(void *s) { (void)s; return NULL; }
void PK11_DestroyGenericObjects(void *o) { (void)o; }
void *PK11_FindGenericObjects(void *s, int oid) { (void)s;(void)oid; return NULL; }
void *PK11_GetNextGenericObject(void *o) { (void)o; return NULL; }
PRBool PK11_HasAttributeSet(void *o, unsigned int t, PRBool w) { (void)o;(void)t;(void)w; return 0; }
SECStatus PK11_ReadRawAttribute(int type, void *o, SECItem *it) { (void)type;(void)o;(void)it; return -1; }
PRBool PK11_NeedUserInit(void *s) { (void)s; return 0; }
SECStatus PK11_InitPin(void *s, const char *a, const char *b) { (void)s;(void)a;(void)b; return 0; }
void PK11_SetPasswordFunc(void *f) { (void)f; }

/* ---- SECMOD ---- */
void *SECMOD_GetDefaultModuleList(void) { return NULL; }
static int g_lock_tag = 1;
void *SECMOD_GetDefaultModuleListLock(void) { return &g_lock_tag; }
/* no-op : un mutex réel provoquerait un interblocage si Chromium verrouille deux fois dans le même thread */
void SECMOD_GetReadLock(void *l) { (void)l; }
void SECMOD_ReleaseReadLock(void *l) { (void)l; }
void *SECMOD_LoadUserModule(char *a, char *b, PRBool c) { (void)a;(void)b;(void)c; return NULL; }
void SECMOD_DestroyModule(void *m) { (void)m; }

/* ---- shim OpenSSL mémoire (utilisé par le net stack) ---- */
void *OPENSSL_memory_alloc(size_t n) { return malloc(n); }
void OPENSSL_memory_free(void *p) { free(p); }
size_t OPENSSL_memory_get_size(void *p) { return p ? malloc_usable_size(p) : 0; }
