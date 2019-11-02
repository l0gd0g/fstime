#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <fcntl.h>

#include <node_api.h>

napi_status status;

napi_status setProperty(napi_env env, napi_value& stats, const char* name, int64_t value) {
    napi_value val;
    status = napi_create_int64(env, value, &val);
    if (status != napi_ok) {
        napi_throw_type_error(env, NULL, "Error on transforming Number");
        return status;
    }
    status = napi_set_named_property(env, stats, name, val);
    if (status != napi_ok) {
        napi_throw_type_error(env, NULL, "Error on setting Number to stats");
    }
    return status;
}

napi_value StatSync(napi_env env, napi_callback_info args) {
    size_t argc = 1;
    napi_value argv[1];
    status = napi_get_cb_info(env, args, &argc, argv, NULL, NULL);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Error on getting arguments");
        return NULL;
    }
    napi_value napi_fileName = argv[0];

    size_t fileNameSize;
    status = napi_get_value_string_utf8(env, napi_fileName, NULL, NAPI_AUTO_LENGTH, &fileNameSize);
    if (status != napi_ok) {
        napi_throw_type_error(env, NULL, "Path must be string value");
        return NULL;
    }
    fileNameSize += 1;

    char fileName[fileNameSize];
    status = napi_get_value_string_utf8(env, napi_fileName, fileName, fileNameSize, NULL);
    if (status != napi_ok) {
        napi_throw_type_error(env, NULL, "Path must be string value");
        return NULL;
    }
    struct stat sb;
    if (lstat(fileName, &sb) == -1) {
        napi_throw_type_error(env, NULL, "Wrong file stat");
        return NULL;
    }

    napi_value stats;
    status = napi_create_object(env, &stats);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Error on creating object stats");
        return NULL;
    }

    if (setProperty(env, stats, "dev", sb.st_dev) != napi_ok) return NULL;
    if (setProperty(env, stats, "mode", sb.st_mode) != napi_ok) return NULL;
    if (setProperty(env, stats, "nlink", sb.st_nlink) != napi_ok) return NULL;
    if (setProperty(env, stats, "uid", sb.st_uid) != napi_ok) return NULL;
    if (setProperty(env, stats, "gid", sb.st_gid) != napi_ok) return NULL;
    if (setProperty(env, stats, "rdev", sb.st_rdev) != napi_ok) return NULL;
    if (setProperty(env, stats, "blksize", sb.st_blksize) != napi_ok) return NULL;
    if (setProperty(env, stats, "ino", sb.st_ino) != napi_ok) return NULL;
    if (setProperty(env, stats, "size", sb.st_size) != napi_ok) return NULL;
    if (setProperty(env, stats, "blocks", sb.st_blocks) != napi_ok) return NULL;

    if (setProperty(env, stats, "atime_sec", sb.st_atim.tv_sec) != napi_ok) return NULL;
    if (setProperty(env, stats, "atime_nsec", sb.st_atim.tv_nsec) != napi_ok) return NULL;

    if (setProperty(env, stats, "mtime_sec", sb.st_mtim.tv_sec) != napi_ok) return NULL;
    if (setProperty(env, stats, "mtime_nsec", sb.st_mtim.tv_nsec) != napi_ok) return NULL;

    if (setProperty(env, stats, "ctime_sec", sb.st_ctim.tv_sec) != napi_ok) return NULL;
    if (setProperty(env, stats, "ctime_nsec", sb.st_ctim.tv_nsec) != napi_ok) return NULL;

    return stats;
}

napi_value UtimesSync(napi_env env, napi_callback_info args) {
    size_t argc = 5;
    napi_value argv[5];
    status = napi_get_cb_info(env, args, &argc, argv, NULL, NULL);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Error on getting arguments");
        return NULL;
    }
    napi_value napi_fileName = argv[0];

    size_t fileNameSize;
    status = napi_get_value_string_utf8(env, napi_fileName, NULL, NAPI_AUTO_LENGTH, &fileNameSize);
    if (status != napi_ok) {
        napi_throw_type_error(env, NULL, "Path must be string value");
        return NULL;
    }
    fileNameSize += 1;

    char fileName[fileNameSize];
    status = napi_get_value_string_utf8(env, napi_fileName, fileName, fileNameSize, NULL);
    if (status != napi_ok) {
        napi_throw_type_error(env, NULL, "Path must be string value");
        return NULL;
    }

    struct stat sb;
    if (lstat(fileName, &sb) == -1) {
        napi_throw_type_error(env, NULL, "Wrong file stat");
        return NULL;
    }

    struct timespec ts[2];
    status = napi_get_value_int64(env, argv[1], &ts[0].tv_sec);
    if (status != napi_ok) {
        napi_throw_type_error(env, NULL, "Error on transforming Number");
        return NULL;
    }
    status = napi_get_value_int64(env, argv[2], &ts[0].tv_nsec);
    if (status != napi_ok) {
        napi_throw_type_error(env, NULL, "Error on transforming Number");
        return NULL;
    }
    status = napi_get_value_int64(env, argv[3], &ts[1].tv_sec);
    if (status != napi_ok) {
        napi_throw_type_error(env, NULL, "Error on transforming Number");
        return NULL;
    }
    status = napi_get_value_int64(env, argv[4], &ts[1].tv_nsec);
    if (status != napi_ok) {
        napi_throw_type_error(env, NULL, "Error on transforming Number");
        return NULL;
    }

    if (utimensat(AT_FDCWD, fileName, ts, AT_SYMLINK_NOFOLLOW) < 0) {
        napi_throw_type_error(env, NULL, "Error on changing time");
        return NULL;
    }
    return NULL;
}

napi_value init(napi_env env, napi_value exports) {
    napi_value statSync;
    status = napi_create_function(env, NULL, 0, StatSync, NULL, &statSync);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Error on creating function");
        return NULL;
    }
    status = napi_set_named_property(env, exports, "statSync", statSync);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Error on setting function");
        return NULL;
    }

    napi_value utimesSync;
    status = napi_create_function(env, NULL, 0, UtimesSync, NULL, &utimesSync);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Error on creating function");
        return NULL;
    }
    status = napi_set_named_property(env, exports, "utimesSync", utimesSync);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Error on setting function");
        return NULL;
    }
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init);
