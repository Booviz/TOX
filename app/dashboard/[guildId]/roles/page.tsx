"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useParams } from "next/navigation"
import {
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { CloneRoleDialog } from "@/components/dashboard/roles/CloneRoleDialog"
import { CreateRoleDialog } from "@/components/dashboard/roles/CreateRoleDialog"
import { DeleteRoleDialog } from "@/components/dashboard/roles/DeleteRoleDialog"
import { EditRoleDialog } from "@/components/dashboard/roles/EditRoleDialog"
import { RoleSidebar } from "@/components/dashboard/roles/RoleSidebar"
import { RolesTable } from "@/components/dashboard/roles/RolesTable"
import { RolesToolbar } from "@/components/dashboard/roles/RolesToolbar"

import type {
  RoleSort,
  RolesApiResponse,
  ServerRole,
} from "@/components/dashboard/roles/types"

const PAGE_SIZE = 10

export default function RolesPage() {
  const params = useParams<{
    guildId: string
  }>()

  const guildId = params.guildId

  const [roles, setRoles] =
    useState<ServerRole[]>([])

  const [guildName, setGuildName] =
    useState("Discord server")

  const [selectedRole, setSelectedRole] =
    useState<ServerRole | null>(null)

  const [createOpen, setCreateOpen] =
    useState(false)

  const [editRole, setEditRole] =
    useState<ServerRole | null>(null)

  const [cloneRole, setCloneRole] =
    useState<ServerRole | null>(null)

  const [deleteRole, setDeleteRole] =
    useState<ServerRole | null>(null)

  const [search, setSearch] =
    useState("")

  const [sort, setSort] =
    useState<RoleSort>("position-desc")

  const [page, setPage] =
    useState(1)

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const loadRoles = useCallback(
    async (silent = false) => {
      try {
        if (silent) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        setError(null)

        const response = await fetch(
          `/api/dashboard/${guildId}/roles`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        )

        const responseText =
          await response.text()

        let data: RolesApiResponse

        try {
          data = responseText
            ? (JSON.parse(
                responseText
              ) as RolesApiResponse)
            : {
                success: response.ok,
              }
        } catch {
          throw new Error(
            "The roles API returned invalid JSON"
          )
        }

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.error ??
              data.message ??
              "Failed to load server roles"
          )
        }

        const loadedRoles =
          data.roles ?? []

        setRoles(loadedRoles)

        if (data.guild?.name) {
          setGuildName(data.guild.name)
        }

        setSelectedRole(
          (currentRole) => {
            if (!currentRole) {
              return null
            }

            return (
              loadedRoles.find(
                (role) =>
                  role.id ===
                  currentRole.id
              ) ?? null
            )
          }
        )
      } catch (loadError) {
        console.error(
          "Failed to load roles:",
          loadError
        )

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load roles"
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [guildId]
  )

  useEffect(() => {
    void loadRoles()
  }, [loadRoles])

  const filteredRoles = useMemo(() => {
    const query =
      search.trim().toLowerCase()

    const result = roles.filter(
      (role) =>
        !query ||
        role.name
          .toLowerCase()
          .includes(query) ||
        role.id.includes(query)
    )

    return [...result].sort(
      (firstRole, secondRole) => {
        switch (sort) {
          case "position-asc":
            return (
              firstRole.position -
              secondRole.position
            )

          case "members-desc":
            return (
              secondRole.memberCount -
              firstRole.memberCount
            )

          case "members-asc":
            return (
              firstRole.memberCount -
              secondRole.memberCount
            )

          case "name-asc":
            return firstRole.name.localeCompare(
              secondRole.name
            )

          case "name-desc":
            return secondRole.name.localeCompare(
              firstRole.name
            )

          case "position-desc":
          default:
            return (
              secondRole.position -
              firstRole.position
            )
        }
      }
    )
  }, [roles, search, sort])

  useEffect(() => {
    setPage(1)
  }, [search, sort])

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredRoles.length / PAGE_SIZE
    )
  )

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const paginatedRoles =
    filteredRoles.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    )

  const totalAssignments = useMemo(
    () =>
      roles.reduce(
        (total, role) =>
          total + role.memberCount,
        0
      ),
    [roles]
  )

  const managedRoles = useMemo(
    () =>
      roles.filter(
        (role) => role.managed
      ).length,
    [roles]
  )

  function upsertRole(
    updatedRole: ServerRole
  ) {
    setRoles((current) => {
      const exists = current.some(
        (role) =>
          role.id === updatedRole.id
      )

      if (!exists) {
        return [
          updatedRole,
          ...current,
        ]
      }

      return current.map((role) =>
        role.id === updatedRole.id
          ? updatedRole
          : role
      )
    })

    setSelectedRole(updatedRole)
  }

  function removeRole(roleId: string) {
    setRoles((current) =>
      current.filter(
        (role) => role.id !== roleId
      )
    )

    setSelectedRole(
      (currentRole) =>
        currentRole?.id === roleId
          ? null
          : currentRole
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />

          <p className="mt-4 text-sm text-muted-foreground">
            Loading server roles...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6 text-center">
          <AlertTriangle className="mx-auto size-10 text-red-400" />

          <h2 className="mt-4 text-lg font-semibold">
            Failed to load roles
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {error}
          </p>

          <Button
            type="button"
            className="mt-5 gap-2"
            onClick={() =>
              void loadRoles()
            }
          >
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full px-6 py-7 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <RolesToolbar
          guildName={guildName}
          totalRoles={roles.length}
          managedRoles={managedRoles}
          totalAssignments={
            totalAssignments
          }
          search={search}
          sort={sort}
          refreshing={refreshing}
          onSearchChange={setSearch}
          onSortChange={setSort}
          onRefresh={() =>
            void loadRoles(true)
          }
          onCreateRole={() => {
            setSelectedRole(null)
            setCreateOpen(true)
          }}
        />

        <RolesTable
          roles={paginatedRoles}
          page={page}
          totalPages={totalPages}
          totalCount={
            filteredRoles.length
          }
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onSelectRole={
            setSelectedRole
          }
        />
      </div>

      <CreateRoleDialog
        guildId={guildId}
        open={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
        onCreated={(role) => {
          upsertRole(role)
          setCreateOpen(false)
        }}
      />

      <EditRoleDialog
        guildId={guildId}
        role={editRole}
        open={Boolean(editRole)}
        onClose={() =>
          setEditRole(null)
        }
        onUpdated={(role) => {
          upsertRole(role)
          setEditRole(null)
        }}
      />

      <CloneRoleDialog
        guildId={guildId}
        role={cloneRole}
        open={Boolean(cloneRole)}
        onClose={() =>
          setCloneRole(null)
        }
        onCloned={(role) => {
          upsertRole(role)
          setCloneRole(null)
        }}
      />

      <DeleteRoleDialog
        guildId={guildId}
        role={deleteRole}
        open={Boolean(deleteRole)}
        onClose={() =>
          setDeleteRole(null)
        }
        onDeleted={(roleId) => {
          removeRole(roleId)
          setDeleteRole(null)
        }}
      />

      {selectedRole && (
        <RoleSidebar
          role={selectedRole}
          onClose={() =>
            setSelectedRole(null)
          }
          onEdit={(role) => {
            setSelectedRole(null)
            setEditRole(role)
          }}
          onClone={(role) => {
            setSelectedRole(null)
            setCloneRole(role)
          }}
          onDelete={(role) => {
            setSelectedRole(null)
            setDeleteRole(role)
          }}
        />
      )}
    </div>
  )
}